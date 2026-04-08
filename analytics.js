import { supabase } from "./supabase.js";

const owner = JSON.parse(localStorage.getItem("owner"));
if (!owner) window.location.href = "index.html";

const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");

// Show welcome message
window.addEventListener("load", () => {
    setTimeout(() => {
        addAIMessage("👋 Hello! I'm your inventory AI assistant. Ask me about your products, profits, stock levels, or sales. What would you like to know?");
    }, 500);
});

function addUserMessage(text) {
    const msgEl = document.createElement("div");
    msgEl.className = "user-msg";
    msgEl.innerHTML = `<strong>You:</strong> ${text}`;
    chatBox.appendChild(msgEl);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addAIMessage(text) {
    const msgEl = document.createElement("div");
    msgEl.className = "ai-msg";
    msgEl.innerHTML = `<strong>AI:</strong> ${text.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}`;
    chatBox.appendChild(msgEl);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addErrorMessage(text) {
    const msgEl = document.createElement("div");
    msgEl.className = "ai-msg error";
    msgEl.innerHTML = `<strong>AI:</strong> ${text}`;
    chatBox.appendChild(msgEl);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Smart AI Response Generator
async function generateAIResponse(question, inventoryData) {
    const q = question.toLowerCase().trim();
    
    // If no products, give helpful message
    if (!inventoryData || inventoryData.length === 0) {
        return "📦 You don't have any products in your inventory yet. Go to the **Inventory** page and add some products first, then ask me questions!";
    }

    // Calculate stats from inventory
    const stats = {
        totalProducts: inventoryData.length,
        totalStock: inventoryData.reduce((sum, p) => sum + (p.stock || 0), 0),
        totalProfit: inventoryData.reduce((sum, p) => sum + (p.profit || 0), 0),
        totalSold: inventoryData.reduce((sum, p) => sum + (p.sold || 0), 0),
        totalCost: inventoryData.reduce((sum, p) => sum + ((p.cost || 0) * (p.stock || 0)), 0),
        lowStock: inventoryData.filter(p => (p.stock || 0) < 5),
        outOfStock: inventoryData.filter(p => (p.stock || 0) === 0),
        expiringSoon: inventoryData.filter(p => {
            if (!p.expiry) return false;
            const expiry = new Date(p.expiry);
            const today = new Date();
            const days = (expiry - today) / (1000 * 60 * 60 * 24);
            return days >= 0 && days <= 3;
        }),
        topSellers: inventoryData.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 3),
        allProducts: inventoryData
    };

    // Profit keyword
    if (q.includes("profit")) {
        const profitText = `💰 Your **total profit** is **$${stats.totalProfit.toFixed(2)}**!`;
        if (stats.totalProfit === 0) {
            return `${profitText}\n\nNo sales yet. Start selling products to earn profit!`;
        }
        return `${profitText}\n\nGreat job! You've made excellent sales. Keep it up! 📈`;
    }

    // How many questions
    if (q.includes("how many") || q.includes("total") || q.includes("count")) {
        if (q.includes("product")) {
            return `📦 You have **${stats.totalProducts}** product(s) in inventory.`;
        }
        if (q.includes("sold")) {
            return `🛒 You've sold **${stats.totalSold}** units total!`;
        }
        if (q.includes("stock")) {
            return `📊 Total stock: **${stats.totalStock}** units across all products.`;
        }
    }

    // Low stock questions
    if (q.includes("low stock") || q.includes("low inventory") || q.includes("need restock") || q.includes("running out")) {
        if (stats.lowStock.length === 0) {
            return `✅ **Great news!** All your products have healthy stock levels (5+ units each). No restocking needed right now!`;
        }
        const lowList = stats.lowStock.map(p => `• **${p.name}**: ${p.stock} units left`).join("\n");
        return `⚠️ **Low stock alert!** These items need restocking soon:\n\n${lowList}`;
    }

    // Out of stock
    if (q.includes("out of stock") || q.includes("0 in stock") || q.includes("no stock")) {
        if (stats.outOfStock.length === 0) {
            return `✅ **Perfect!** No items are out of stock. Your inventory is well-supplied!`;
        }
        const outList = stats.outOfStock.map(p => `• ${p.name}`).join("\n");
        return `❌ **Out of stock items:**\n${outList}\n\nConsider restocking these ASAP!`;
    }

    // Expiring items
    if (q.includes("expir")) {
        if (stats.expiringSoon.length === 0) {
            return `✅ **Excellent!** No items expiring soon. Everything is fresh!`;
        }
        const expireList = stats.expiringSoon.map(p => `• **${p.name}** - Expires: ${p.expiry}`).join("\n");
        return `⏰ **Items expiring within 3 days:**\n${expireList}\n\nSell these urgently!`;
    }

    // Best sellers
    if (q.includes("best sell") || q.includes("top product") || q.includes("most sell") || q.includes("popular")) {
        if (stats.topSellers.length === 0 || !stats.topSellers[0]) {
            return `📈 No sales recorded yet. Start selling to see your top products!`;
        }
        const topList = stats.topSellers
            .filter(p => p.sold > 0)
            .map((p, i) => `${i + 1}. **${p.name}** - ${p.sold} units sold`)
            .join("\n");
        if (!topList) {
            return `📈 No sales recorded yet. Start selling to see your top products!`;
        }
        return `🏆 **Your Top Selling Products:**\n${topList}`;
    }

    // Show all products
    if (q.includes("all product") || q.includes("show product") || q.includes("list product")) {
        const productList = stats.allProducts
            .map(p => `• **${p.name}** - Stock: ${p.stock}, Sold: ${p.sold || 0}, Profit: $${(p.profit || 0).toFixed(2)}`)
            .join("\n");
        return `📋 **All Your Products:**\n${productList}`;
    }

    // Inventory summary
    if (q.includes("summary") || q.includes("overview") || q.includes("status") || q.includes("inventory")) {
        return `📊 **Your Inventory Summary:**
• Total Products: **${stats.totalProducts}**
• Total Stock: **${stats.totalStock}** units
• Items Sold: **${stats.totalSold}**
• Total Profit: **$${stats.totalProfit.toFixed(2)}**
• Low Stock Items: **${stats.lowStock.length}**
• Out of Stock: **${stats.outOfStock.length}**`;
    }

    // Help
    if (q.includes("help") || q.includes("what can") || q.includes("tell me") || q.includes("menu")) {
        return `🤖 **I can help you with:**
• Total profit & sales numbers
• Inventory status & counts
• Low stock alerts
• Out of stock items
• Expiring products
• Best selling products
• Complete product list
• Full inventory overview

Just ask me naturally - I understand various ways of asking!`;
    }

    // Default helpful response
    return `📊 I'm analyzing your inventory. You have:
• **${stats.totalProducts}** products
• **${stats.totalStock}** total units
• **$${stats.totalProfit.toFixed(2)}** profit earned
• **${stats.totalSold}** units sold

Ask me about profit, stock levels, top sellers, expiring items, or anything else about your inventory!`;
}

// Send message handler
async function sendMessage() {
    const input = userInput.value.trim();
    if (!input) return;

    // Add user message to chat
    addUserMessage(input);
    userInput.value = "";

    try {
        // Fetch products from Supabase
        console.log("Fetching inventory data...");
        const { data, error } = await supabase.from("products").select("*");

        if (error) {
            console.error("Supabase error:", error);
            addErrorMessage("❌ Cannot connect to database. Make sure your tables are set up in Supabase.");
            return;
        }

        console.log("Data received:", data);

        // Generate response
        const response = await generateAIResponse(input, data);
        
        // Add AI response
        addAIMessage(response);

    } catch (error) {
        console.error("Chat error:", error);
        addErrorMessage("❌ Something went wrong. Please check the browser console for details.");
    }
}

// Event listeners
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});

// Sidebar toggle
document.getElementById("openSidebar").onclick = () => {
    document.getElementById("sidebar").classList.toggle("collapsed");
};

// Logout
document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("owner");
    window.location.href = "index.html";
};

console.log("✅ AI Chat loaded successfully");
