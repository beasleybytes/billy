document.addEventListener("DOMContentLoaded", () => {
    const nameInput = document.getElementById("name-input");
    const amountInput = document.getElementById("amount-input");
    const typeInput = document.getElementById("type-input");
    const addBillButton = document.getElementById("add-bill");
    const billList = document.getElementById("bill-list");
    const totalIncome = document.getElementById("total-income");
    const totalExpenses = document.getElementById("total-expenses");
    const netBalance = document.getElementById("net-balance");
  
    // Load bills on startup
    loadBills();
  
    // Add bill
    addBillButton.addEventListener("click", async () => {
      const name = nameInput.value.trim();
      const amount = parseFloat(amountInput.value.trim());
      const type = typeInput.value;
      if (name && !isNaN(amount)) {
        await window.electronAPI.addBill(name, amount, type);
        nameInput.value = "";
        amountInput.value = "";
        loadBills();
      } else {
        alert("Please enter valid name and amount.");
      }
    });
  
    // Load bills and calculate totals
    async function loadBills() {
      const bills = await window.electronAPI.getBills();
      billList.innerHTML = "";
      let totalIncomeAmount = 0;
      let totalExpensesAmount = 0;
  
      bills.forEach((bill) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${bill.name} - $${bill.amount.toFixed(2)} (${bill.type})</span>
          <div>
            <button class="edit-btn" data-id="${bill.id}">Edit</button>
            <button class="delete-btn" data-id="${bill.id}">Delete</button>
          </div>
        `;
        billList.appendChild(li);
  
        if (bill.type === "income") {
          totalIncomeAmount += bill.amount;
        } else {
          totalExpensesAmount += bill.amount;
        }
      });
  
      // Display totals
      totalIncome.textContent = totalIncomeAmount.toFixed(2);
      totalExpenses.textContent = totalExpensesAmount.toFixed(2);
      netBalance.textContent = (totalIncomeAmount - totalExpensesAmount).toFixed(2);
  
      // Add event listeners for edit and delete buttons
      document.querySelectorAll(".edit-btn").forEach((button) => {
        button.addEventListener("click", async (event) => {
          const id = Number(event.target.getAttribute("data-id"));
          const newName = prompt("Enter new name:");
          const newAmount = parseFloat(prompt("Enter new amount:"));
          if (newName && !isNaN(newAmount)) {
            await window.electronAPI.editBill(id, newName, newAmount);
            loadBills();
          } else {
            alert("Please enter valid name and amount.");
          }
        });
      });
  
      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", async (event) => {
          const id = Number(event.target.getAttribute("data-id"));
          await window.electronAPI.deleteBill(id);
          loadBills();
        });
      });
    }
  });