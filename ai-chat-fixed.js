<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventory - Smart AI</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
            <div class="logo"><h2>Smart AI</h2></div>
            <nav class="menu">
                <a href="dashboard.html">Dashboard</a>
                <a href="inventory.html">Inventory</a>
                <a href="analytics.html">Analytics</a>
                <a href="ai-chat.html">AI Chat</a>
            </nav>
            <div class="sidebar-bottom">
                <button id="logoutBtn" style="width:100%; background:#ef4444; border-radius: 8px; margin-top: auto;">Logout</button>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main">
            <header style="display:flex; align-items:center; gap:15px; margin-bottom:20px;">
                <button id="openSidebar" class="menu-btn">☰</button>
                <h2>Product Inventory</h2>
            </header>

            <!-- Add Product Card -->
            <div class="card">
                <h3>Add New Product</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                    <input type="text" id="productName" placeholder="Product Name">
                    <input type="number" id="productStock" placeholder="Stock Quantity">
                    <input type="number" id="productCost" placeholder="Cost Price ($)">
                    <input type="number" id="productSelling" placeholder="Selling Price ($)">
                    <input type="date" id="productExpiry" title="Expiry Date">
                </div>
                <button id="addBtn" style="width: 100%; margin-top: 15px;">Add to Inventory</button>
            </div>

            <!-- Product Table Card -->
            <div class="card" style="overflow-x: auto;">
                <h3>Current Stock</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Stock</th>
                            <th>Cost</th>
                            <th>Price</th>
                            <th>Expiry</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="productTable"></tbody>
                </table>
            </div>
        </main>
    </div>
    <script type="module" src="js/inventory.js"></script>
</body>
</html>
