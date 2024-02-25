var cart = [];
var total = 0;

// fungsi untuk menambahkan barang
function addItem() {
    const itemName = document.getElementById('nama-barang').value;
    const itemPrice = parseFloat(document.getElementById('harga-barang').value);
    const quantity = parseFloat(document.getElementById('jumlah-beli').value);

    // validasi form
    if (!itemName || isNaN(itemPrice) || itemPrice  <= 0 || isNaN(quantity) || quantity <=0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter valid item name and price.!",

      });
     
        return;
    }
    // memasukkan data barang kedalam array cart
    total += (itemPrice * quantity);
    var subtotal = itemPrice * quantity
    cart.push({ itemName, itemPrice , quantity, subtotal});

    displayCart();
    clearInputs();
}

// Fungsi untuk menampilkan modal SweetAlert dan mengupdate item
async function updateItem(index) {
  const { value: newQuantity } = await Swal.fire({
      title: "Update Quantity",
      input: "text",
      inputLabel: "New Quantity",
      inputValue: cart[index].quantity,
      showCancelButton: true,
      inputValidator: (value) => {
        // Validasi Input
          if (!value || isNaN(value) || parseInt(value) <= 0) {
              return "Please enter a valid quantity!";
          }
      }
  });
  // Kondisi jika valid
  if (newQuantity) {
    if(newQuantity < cart[index].quantity){
      total -= ((cart[index].quantity - newQuantity) *cart[index].itemPrice)
      cart[index].quantity = parseInt(newQuantity);
      cart[index].subtotal = cart[index].quantity * cart[index].itemPrice;
    } else{
      total += (( newQuantity - cart[index].quantity ) *cart[index].itemPrice)
      cart[index].quantity = parseInt(newQuantity);
      cart[index].subtotal = cart[index].quantity * cart[index].itemPrice;
    }
    displayCart(); // Memperbarui tampilan keranjang setelah pembaruan
    clearInputs();
    Swal.fire("Success", "Item quantity updated!", "success");
  }
}

// Fungsi untuk menghapus item dari keranjang
function deleteItem(index) {
  
  Swal.fire({
    title: "Apakah kamu yakin?",
    text: "Kamu tidak bisa memulihkan lagi!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, Hapus!"
  }).then((result) => {
    if (result.isConfirmed) {
      
      total -= cart[index].subtotal
      cart.splice(index, 1); // Menghapus item dari array cart berdasarkan index
      displayCart(); // Memperbarui tampilan keranjang setelah penghapusan
      clearInputs();
      Swal.fire({
        title: "Terhapus!",
        text: "Item Belanja Sudah Terhapus.",
        icon: "success"
      });
    }
  });



}

// Membuat fungsi untuk menampilkan cart dalam bentuk tabel
function displayCart() {
const cartItemsElement = document.getElementById('cart-items');
cartItemsElement.innerHTML = '';
document.getElementById('cart-items').innerHTML = ("<tr><th>Nama Barang</th><th>Jumlah</th><th>Harga</th><th>Subtotal</th><th>Action</th></tr>")

cart.forEach((item, index) => {

    var row = cartItemsElement.insertRow(); // Menambahkan baris baru

    // Menambahkan sel-sel ke dalam baris

    var cellNama = row.insertCell(0);
    var cellQuantity = row.insertCell(1);
    var cellHarga = row.insertCell(2);
    var cellSubtotal = row.insertCell(3);
    var cellActions = row.insertCell(4);
    cellActions.classList.add("cell-actions"); // Menambahkan kelas CSS untuk mengatur tata letak
    
    // Mengisi nilai dari sel-sel dengan data dari arrayBarang
   
    cellNama.innerText = item.itemName;
    cellQuantity.innerText = item.quantity;
    cellHarga.innerText = ("Rp"+item.itemPrice);
    cellSubtotal.innerText = ("Rp"+item.subtotal);

    // Menambahkan tombol update dan delete
    var updateButton = document.createElement("button");
    updateButton.innerText = "Update";
    updateButton.setAttribute("onclick", `updateItem(${index})`);
    updateButton.classList.add("update-button"); // Menambahkan kelas CSS untuk mengatur warna

    var deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.setAttribute("onclick", `deleteItem(${index})`);
    deleteButton.classList.add("delete-button"); // Menambahkan kelas CSS untuk mengatur warna

    cellActions.appendChild(updateButton);
    cellActions.appendChild(deleteButton);
   
});

//menampilkan total belanja
document.getElementById('total1').textContent = total.toFixed(2);
}

// Fungsi untuk menghitung total dan mengisi label total
function hitungTotal() {
  var harga = parseFloat(document.getElementById('harga-barang').value);
  var jumlah = parseInt(document.getElementById('jumlah-beli').value);
  var total = harga * jumlah;
  document.getElementById('total').value = total.toFixed(2);
 
}

// Fungsi untuk menghitung kembalian dan mengisi label kembalian
function hitungKembalian() {
  
  var bayar = parseFloat(document.getElementById('bayar').value);
  var kembalian = bayar - total;
  document.getElementById('kembalian').value = kembalian.toFixed(2);
}

// Membuat Fungsi untuk mencetak invoice
function cetakStruk() {

  var invoiceHTML = "<h2>Rincian Barang</h2><table > <tr><th>Nama Barang</th><th>Jumlah</th><th>Harga</th><th>Subtotal</th></tr>";

    
    var bayar = parseFloat(document.getElementById('bayar').value);
    var kembalian = parseFloat(document.getElementById('kembalian').value);

    // Validasi form pembayaran
    if ( isNaN(total) || isNaN(bayar) || isNaN(kembalian)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Semua field harus diisi dengan benar!",

      });
      
      return;
    } else if(bayar<=0 || kembalian < 0){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Maaf Uang Anda Kurang !",

      });
      return;
    }

    // Membuat tabel di invoice
  cart.forEach(item => {

    var namaBarang = item.itemName;
    var harga = item.itemPrice;
    var jumlah = item.quantity;
    var subtotal = item.subtotal;

    // validasi
    if (namaBarang === "" || isNaN(harga) || isNaN(jumlah) ) {
      alert("Semua field harus diisi dengan benar!");
      return;
    }

      invoiceHTML += " <tr><td>" + namaBarang + "</td><td>" + jumlah + "</td><td>Rp" + harga.toFixed(2) + "</td><td>Rp" + subtotal.toFixed(2) + "</td></tr>";

    });
    invoiceHTML += "</table>"; 

      var report =  
      "<h2> Rincian Pembayaran</h2> <hr>"+      
      "<p><strong>Total:</strong> Rp" + total.toFixed(2) + "</p>" +
      "<p><strong>Pembayaran:</strong> Rp" + bayar.toFixed(2) + "</p>" +
      "<p><strong>Kembalian:</strong> Rp" + kembalian.toFixed(2) + "</p> </table>";

      var cetakStrukHTML = invoiceHTML + report;

  return cetakStrukHTML;
}

// Event listener untuk tombol buka invoice
document.getElementById("bayar-woi").addEventListener("click", function() {
  var bayar = parseFloat(document.getElementById('bayar').value);
  var kembalian = parseFloat(document.getElementById('kembalian').value);
  if(bayar<=0 ||  kembalian < 0 ){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Maaf Uang Anda Kurang !",

    });
    clearInputs();
  return;
  } else if (total <= 0){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Maaf Belanja dulu dong baru bayar !",

    });
    clearInputs();
  return;
  }else if ( isNaN(total) || isNaN(bayar) || isNaN(kembalian)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Semua field harus diisi dengan benar!",

    });
    clearInputs();
    return;
  }

  var newWindow = window.open("app/invoice.html", "_blank");

newWindow.onload = function() {
    // Mendapatkan elemen dengan ID "invoice-content" di dokumen tab baru
    var invoiceContent = newWindow.document.getElementById("invoice-content");

    // Memeriksa apakah elemen ditemukan sebelum mencoba mengubah isinya
    if (invoiceContent) {
        // Mengubah isi elemen dengan cetakStruk()
        invoiceContent.innerHTML = cetakStruk();
        newWindow.window.print();
    } else {
        alert("Elemen dengan ID 'invoice-content' tidak ditemukan.");
    }
};
});

// Membuat fungsi untuk membersihkan inputan setelah menekan tombol tambah item
function clearInputs() {
    document.getElementById('nama-barang').value = '';
    document.getElementById('harga-barang').value = '';
    document.getElementById('jumlah-beli').value = '';
    document.getElementById('total').value = '';
    document.getElementById('bayar').value = '';
    document.getElementById('kembalian').value = '';
}

// Animasi menampilkan form dan tabel
document.addEventListener("DOMContentLoaded", function() {
  var elements = document.querySelectorAll('  .header, .cart-section,.pembayaran');

  elements.forEach(function(element) {
    element.classList.add('slide-in');
  });
});
