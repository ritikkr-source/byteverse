import { supabase } from "./supabase.js";

const owner = JSON.parse(localStorage.getItem("owner"));
if (!owner) window.location.href = "index.html";

const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

// Smart AI Response Generator based on user input
async function generateAIResponse(question, inventoryData) {
    const q = question.toLowerCase();
    
    // Calculate stats
    const stats = {
        totalProducts: inventoryData.length,
        totalStock: inventoryData.reduce((sum, p) => sum + (p.stock || 0), 0),
        totalProfit: inventoryData.reduce((sum, p) => sum + (p.profit || 0), 0),
        totalSold: inventoryData.reduce((sum, p) => sum + (p.sold || 0), 0),
        lowStock: inventoryData.filter(p => p.stock < 5),
        outOfStock: inventoryData.filter(p => p.stock === 0),
        expiringSoon: inventoryData.filter(p => {
            const expiry = new Date(p.expiry);
            const today = new Date();
            const days = (expiry - today) / (1000 * 60 * 60 * 24);
            return days >= 0 && days <= 3;
        }),
        topSellers: inventoryData.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 3),
        highestProfit: inventoryData.filter(p => (p.profit || 0) > 0).sort((a, b) => (b.profit || 0) - (a.profit || 0))[0]
    };

    // Handle different types of questions
    if (q.includes("how many") || q.includes("total") || q.includes("count")) {
        if (q.includes("product")) {
            return `📦 You have **${stats.totalProducts}** products in your inventory.`;
        }
        if (q.includes("sold") || q.includes("sale")) {
            return `🛒 You've sold **${stats.totalSold}** units in total.`;
        }
        if (q.includes("stock")) {
            return `📊 Total stock across all products: **${stats.totalStock}** units.`;
        }
    }
    
    if (q.includes("profit")) {
        return `💰 Your total profit is **$${stats.totalProfit.toFixed(2)}**. Keep up the great sales!`;
    }
    
    if (q.includes("low stock") || q.includes("low inventory") || q.includes("need")) {
        if (stats.lowStock.length === 0) {
            return `✅ Great! All products have good stock levels. No items below 5 units.`;
        }
        const lowItems = stats.lowStock.map(p => `${p.name} (${p.stock} left)`).join(", ");
        return `⚠️ Low stock alert! These items need restocking:\n${stats.lowStock.map(p => `• ${p.name}: ${p.stock} units`).join("\n")}`;
    }
    
    if (q.includes("out of stock") || q.includes("0 stock")) {
        if (stats.outOfStock.length === 0) {
            return `✅ No items are out of stock! Your inventory is well supplied.`;
        }
        return `❌ Out of stock items:\n${stats.outOfStock.map(p => `• ${p.name}`).join("\n")}`;
    }
    
    if (q.includes("expir")) {
        if (stats.expiringSoon.length === 0) {
            return `✅ No items expiring soon. Everything is fresh!`;
        }
        return `⏰ Items expiring soon:\n${stats.expiringSoon.map(p => `• ${p.name} - ${p.expiry}`).join("\n")}`;
    }
    if (q.includes("best sell") || q.includes("top product") || q.includes("most sell")) {
        if (stats.topSellers.length === 0) {
            return `📈 No sales recorded yet. Start selling!`;
        }
        return `🏆 Top selling products:\n${stats.topSellers.map((p, i) => `${i+1}. ${p.name} - ${p.sold || 0} units sold`).join("\n")}`;
    }
    
    if (q.includes("highest profit") || q.includes("best profit")) {
        if (!stats.highestProfit) {
            return `💹 No sales with profit yet.`;
        }
        return `💎 Highest profit item: **${stats.highestProfit.name}** with $${(stats.highestProfit.profit || 0).toFixed(2)} profit!`;
    }
    
    if (q.includes("inventory") || q.includes("stock") || q.includes("product")) {
        return `📊 **Inventory Summary:**\n• Total Products: ${stats.totalProducts}\n• Total Stock: ${stats.totalStock} units\n• Items Sold: ${stats.totalSold}\n• Total Profit: $${stats.totalProfit.toFixed(2)}\n• Low Stock: ${stats.lowStock.length} items`;
    }
    
    if (q.includes("help") || q.includes("what can") || q.includes("tell me")) {
        return `🤖 I can help you with:\n• Stock levels & inventory status\n• Sales performance & top sellers\n• Profit analysis\n• Low stock alerts\n• Expiring items\n• Product counts\n\nJust ask me anything about your inventory!`;
    }
    
    // Default response if question doesn't match patterns
    return `📊 I can analyze your inventory data. You have ${stats.totalProducts} products with ${stats.totalStock} total units in stock and $${stats.totalProfit.toFixed(2)} in profits. Ask me about:\n• Profit & sales\n• Low stock items\n• Best selling products\n• Expiring items\n• Inventory stats`;
}

async function sendMessage() {
    const input = userInput.value.trim();
    if (!input) return;

    // Add user message
    const userMsgEl = document.createElement("div");
    userMsgEl.className = "user-msg";
    userMsgEl.innerHTML = `<strong>You:</strong> ${input}`;
    chatBox.appendChild(userMsgEl);
    
    userInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // Fetch inventory data
        const { data: inventoryData, error } = await supabase.from("products").select("*");
        
        if (error) throw error;
        if (!inventoryData) throw new Error("No data received");

        // Generate smart response
        const reply = await generateAIResponse(input, inventoryData);

        // Add AI response
        const aiMsgEl = document.createElement("div");
        aiMsgEl.className = "ai-msg";
        aiMsgEl.innerHTML = `<strong>AI:</strong> ${reply.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}`;
        chatBox.appendChild(aiMsgEl);
        
    } catch (error) {
        console.error("Error:", error);
        const errorEl = document.createElement("div");
        errorEl.className = "ai-msg error";
        errorEl.innerHTML = `<strong>AI:</strong> ❌ Error loading data. Please try again.`;
        chatBox.appendChild(errorEl);
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById("openSidebar").onclick = () => document.getElementById("sidebar").classList.toggle("collapsed");
document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("owner");
    window.location.href = "index.html";
};
