import { supabase } from "./supabase.js";

const owner = JSON.parse(localStorage.getItem("owner"));
if (!owner) window.location.href = "index.html";

let stockChart;

async function loadDashboard() {
    const { data, error } = await supabase.from("products").select("*");
    if (error) return console.error(error);

    document.getElementById("totalProducts").innerText = data.length;
    document.getElementById("lowStock").innerText = data.filter(p => p.stock < 5).length;
    
    const profit = data.reduce((sum, p) => sum + (p.profit || 0), 0);
    document.getElementById("totalProfit").innerText = `$${profit.toLocaleString()}`;

    const labels = data.map(p => p.name);
    const stockValues = data.map(p => p.stock);

    const ctx = document.getElementById("stockChart");
    if (stockChart) stockChart.destroy();
    stockChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{ label: 'Items in Stock', data: stockValues, backgroundColor: '#2563eb' }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("owner");
    window.location.href = "index.html";
};

document.getElementById("openSidebar").onclick = () => document.getElementById("sidebar").classList.toggle("collapsed");

loadDashboard();
