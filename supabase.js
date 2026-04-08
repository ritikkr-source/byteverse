import { supabase } from "./supabase.js";

const owner = JSON.parse(localStorage.getItem("owner"));
if (!owner) window.location.href = "index.html";

// Add Product
window.addProduct = async function() {
    const name = document.getElementById("productName").value.trim();
    const stock = parseInt(document.getElementById("productStock").value);
    const cost = parseFloat(document.getElementById("productCost").value);
    const selling = parseFloat(document.getElementById("productSelling").value);
    const expiry = document.getElementById("productExpiry").value;

    if (!name || isNaN(stock) || isNaN(cost) || isNaN(selling) || !expiry) {
        alert("Please fill all fields correctly.");
        return;
    }

    const { error } = await supabase.from('products').insert([{ 
        name, stock, cost, selling, expiry, sold: 0, profit: 0 
    }]);

    if (error) alert("Error: " + error.message);
    else { clearForm(); loadProducts(); }
};

// Load Products
async function loadProducts() {
    const table = document.getElementById("productTable");
    const { data, error } = await supabase.from('products').select('*').order('name', { ascending: true });

    if (error) return console.error(error);

    table.innerHTML = data.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>${p.stock}</td>
            <td>$${p.cost.toFixed(2)}</td>
            <td>$${p.selling.toFixed(2)}</td>
            <td>${p.expiry}</td>
            <td>
                <button onclick="sellProduct(${p.id})" style="background:#22c55e; margin-right:5px;">Sell</button>
                <button onclick="deleteProduct(${p.id})" style="background:#ef4444;">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Delete Product
window.deleteProduct = async (id) => {
    if (confirm("Delete this item?")) {
        await supabase.from('products').delete().eq('id', id);
        loadProducts();
    }
};

// Sell Product
window.sellProduct = async (id) => {
    const { data } = await supabase.from("products").select("*").eq("id", id).single();
    if (data.stock <= 0) return alert("Out of stock!");

    await supabase.from("products").update({
        stock: data.stock - 1,
        sold: (data.sold || 0) + 1,
        profit: (data.profit || 0) + (data.selling - data.cost)
    }).eq("id", id);

    loadProducts();
};

function clearForm() {
    ["productName", "productStock", "productCost", "productSelling", "productExpiry"].forEach(id => document.getElementById(id).value = "");
}

document.getElementById("addBtn").addEventListener("click", addProduct);
document.getElementById("openSidebar").onclick = () => document.getElementById("sidebar").classList.toggle("collapsed");
document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("owner");
    window.location.href = "index.html";
};

loadProducts();
