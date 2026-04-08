import { supabase } from "./supabase.js";

const owner = JSON.parse(localStorage.getItem("owner"));
if (!owner) window.location.href = "index.html";

let salesChart, profitChart;

async function loadAnalytics() {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
        console.error(error);
        return;
    }

    const today = new Date();

    // Stats
    const lowStock = data.filter(item => item.stock < 5);
    const expiring = data.filter(item => {
        const expiry = new Date(item.expiry);
        const diff = (expiry - today) / (1000 * 60 * 60 * 24);
        return diff < 3 && diff >= 0;
    });

    document.getElementById("totalProducts").innerText = data.length;
    document.getElementById("lowStock").innerText = lowStock.length;
    document.getElementById("expiring").innerText = expiring.length;

    // Top Selling List
    const bestSelling = [...data].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 3);
    const topSellingBox = document.getElementById("topSellingBox");
    topSellingBox.innerHTML = bestSelling.map(item => `
        <div class="top-item" style="display:flex; justify-content:space-between; background:#f1f5f9; padding:10px; margin:5px 0; border-radius:8px;">
            <strong>${item.name}</strong>
            <span>${item.sold || 0} Sold</span>
        </div>
    `).join('');

    renderCharts(data);
}

function renderCharts(data) {
    const labels = data.map(item => item.name);
    
    const ctxSales = document.getElementById("salesChart");
    if (salesChart) salesChart.destroy();
    salesChart = new Chart(ctxSales, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{ label: "Units Sold", data: data.map(i => i.sold || 0), backgroundColor: "#2563eb" }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    const ctxProfit = document.getElementById("profitChart");
    if (profitChart) profitChart.destroy();
    profitChart = new Chart(ctxProfit, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{ label: "Profit ($)", data: data.map(i => i.profit || 0), borderColor: "#22c55e", fill: true, tension: 0.4 }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

document.getElementById("openSidebar").onclick = () => document.getElementById("sidebar").classList.toggle("collapsed");
document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("owner");
    window.location.href = "index.html";
};

loadAnalytics();
