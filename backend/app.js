const { Pool } = require('pg');
const { Client, LocalAuth , MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');
const puppeteer = require('puppeteer');

const pool = new Pool({
    host: '85.31.224.243',
    port: 5432, 
    database: 'giras-adventure',
    user: 'postgres',
    password: 'SuksesJooal2024!',
});

// const pool = new Pool({
//     host: 'localhost',
//     port: 5432, 
//     database: 'a2',
//     user: 'postgres',
//     password: 'root',
// });


// const client = new Client({
//     authStrategy: new LocalAuth(),
// });

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true, // Jalankan tanpa GUI
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Tambahkan argumen ini
    },
});


client.on('qr', (qr) => {
    console.log('QR RECEIVED, Scan it to use the service');
    qrcode.generate(qr, { small: true });
});

let isProcessing = false; // Flag untuk mencegah eksekusi bersamaan

client.on('ready', async () => {
    console.log('Client is ready to consume data!');

    setInterval(async () => {
        if (isProcessing) {
            return; // Abaikan jika proses masih berjalan
        }

        isProcessing = true; // Set flag menjadi true
        const queue = await consumeQueueWhatsapp();

        for (const whatsapp of queue) {
            const chatId = whatsapp.phone_number + "@c.us";
        
            const order = whatsapp.order || {}; // Pastikan order tidak undefined
            function formatDate(dateString) {
                const date = new Date(dateString);
                return date.toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric' 
                }) + " - " + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            }
            

            // const formatDate = (date) => date ? new Date(date).toLocaleDateString('id-ID') : "-"; // Format tanggal
            const formatNumber = (num) => num ? `${num.toLocaleString('id-ID')}` : "Rp. 0,"; // Format angka
        
            // Ambil daftar barang sewa dari order.order_products
            const daftarBarang = (order.order_products || []).map(product => 
                `🔹 ${product.name} - Rp. ${formatNumber(product.selling_price)} x ${product.qty} = Rp. ${formatNumber(product.selling_price * product.qty)}`
            ).join("\n");

            let discountText = "";
            let subtotalAfterDiscount = order.subtotal; // Default tanpa diskon

            if (order.type_discount === "percent") {
                let discountAmount = (order.subtotal * (order.percent_discount || 0)) / 100;
                subtotalAfterDiscount -= discountAmount;
                discountText = `${order.percent_discount || 0}% (Rp.${formatNumber(discountAmount)})`;
            } else {
                subtotalAfterDiscount -= order.price_discount || 0;
                discountText = `Rp.${formatNumber(order.price_discount || 0)}`;
            }

            // Sub Total setelah dikurangi diskon
            let subTotalText = `${order.sewa || 1} Malam x ${formatNumber(order.subtotal)} = ${formatNumber((order.sewa || 1) * order.subtotal)}`;
            
            if (order.status_realtime === 'done') {
                // Struk selesai (WA Done)
                message = `*SEWA ALAT CAMPING - GIRAS ADVENTURE*\n` +
                    `RT 04/RW 07, Kebondalem, Madurejo, Kec. Prambanan,\n` +
                    `Kabupaten Sleman, Daerah Istimewa Yogyakarta 55572\n` +
                    `WA ADMIN 08222 360 6899\n` +
                    `====================\n` +
                    `🔢 *No Nota*   : ${order.no_invoice || "-"}\n` +
                    `👤 *Penyewa*  : ${order.customer_name || "-"}\n` +
                    `📍 *Alamat*   : ${order.address || "-"}\n` +
                    `🗓 *Tgl Ambil*  : ${formatDate(order.start_date)}\n` +
                    `🗓 *Tgl Kembali* : ${formatDate(order.end_date)}\n` +
                    `🪪 *Jaminan*   : ${order.guarantee || "-"}\n` +
                    `👩‍💼 *Kasir*   : ${order.cashier_name || "-"}\n` +
                    `====================\n` +
                    `🏕 *Daftar Barang Sewa* :\n${daftarBarang || "Tidak ada barang"}\n` +
                    `💵 *Jumlah* : Rp. ${formatNumber(order.subtotal)}\n` +
                    `💵 *Diskon* : ${discountText}\n` +
                    `💵 *Sub Total*  : ${subTotalText}\n` +
                    `💵 *Perpanjang Sewa* : ${order.denda || 0} Malam\n` +
                    `💵 *Denda Kerusakan* : Rp ${formatNumber(order.denda_barang_rusak || 0)}\n` +
                    `💵 *Total*  : Rp. ${formatNumber(order.total)}\n` +
                    `====================\n` +
                    `🟢 *Status* : Sudah Dikembalikan\n` +
                    `====================\n` +
                    `📌 Terima kasih sudah menyewa perlengkapan camping di tempat kami! Semoga perjalanan Anda seru dan penuh pengalaman berkesan. Jangan ragu untuk kembali lagi ya! 😊\n`;


            } else {
                // Struk biasa
                message = `*SEWA ALAT CAMPING - GIRAS ADVENTURE*\n` +
                        `RT 04/RW 07, Kebondalem, Madurejo, Kec. Prambanan,\n` +
                        `Kabupaten Sleman, Daerah Istimewa Yogyakarta 55572\n` +
                        `WA ADMIN 08222 360 6899\n` +
                        `====================\n` +
                        `🔢 *No Nota*   : ${order.no_invoice || "-"}\n` +
                        `👤 *Penyewa*  : ${order.customer_name || "-"}\n` +
                        `📍 *Alamat*   : ${order.address || "-"}\n` +
                        `🗓 *Tgl Ambil*   : ${formatDate(order.start_date)}\n` +
                        `🗓 *Tgl Kembali* : ${formatDate(order.end_date)}\n` +
                        `🪪 *Jaminan*   : ${order.guarantee || "-"}\n` +
                        `👩‍💼 *Kasir*   : ${order.cashier_name || "-"}\n` +
                        `====================\n` +
                        `🏕 *Daftar Barang Sewa* :\n${daftarBarang || "Tidak ada barang"}\n` +
                        `💵 *Jumlah* : Rp. ${formatNumber(order.subtotal)}\n` +
                        `💵 *Diskon* : ${discountText}\n` +
                        `💵 *Sub Total*  : ${subTotalText}\n` +
                        `💵 *Total*  : Rp. ${formatNumber(order.total)}\n` +
                        `====================\n` +
                        `🟢 *Status* : Sudah Diambil\n` +
                        `====================\n` +
                        `📄 *SYARAT DAN KETENTUAN SEWA*:\n` +
                        `⿡ Saat pengambilan, penyewa wajib meninggalkan kartu identitas asli.\n` +
                        `⿢ Harga Penyewaan dihitung 2 hari 1 malam.\n` +
                        `⿣ Penyewa *WAJIB* menjaga peralatan yang disewa.\n` +
                        `⿤ Apabila ada barang yang disewa rusak/hilang, penyewa dikenakan biaya penggantian.\n` +
                        `⿥ Keterlambatan mengembalikan barang berarti memperpanjang sewa.\n` +
                        `⿥ Barang yang telah disewa sebaiknya diperiksa dahulu sebelum meninggalkan toko, karena setelah meninggalkan toko barang yang telah disewa menjadi tanggung jawab penyewa.\n` +
                        `⿥ Segala bentuk penipuan akan dilaporkan kepada pihak yang berwenang.\n` +
                        `====================\n`;


            }

            try {
                await client.sendMessage(chatId, message);
                console.log(`Pesan berhasil dikirim ke ${whatsapp.phone_number}`);
        
                await deleteQueueWhatsapp(whatsapp.id);
            } catch (error) {
                console.error(`Gagal mengirim pesan ke ${whatsapp.phone_number}:`, error);
            }
        }
        
        
        isProcessing = false; // Reset flag setelah selesai
    }, 1000);
});


// Fungsi untuk mengambil antrian dari database
async function consumeQueueWhatsapp() {
    const resultQuery = await pool.query('SELECT * FROM queue_whatsapps ORDER BY id ASC');
    const data = resultQuery.rows;

    for (const item of data) {
        // Ambil data order
        const orderQuery = await pool.query('SELECT * FROM orders WHERE id = $1', [item.order_id]);
        const orderData = orderQuery.rows[0];

        if (orderData) {
            // Ambil data order_products yang terkait dengan order ini
            const orderProductsQuery = await pool.query('SELECT * FROM order_products WHERE order_id = $1', [orderData.id]);
            orderData.order_products = orderProductsQuery.rows; // Tambahkan ke dalam order
        }

        item.order = orderData;
    }

    return data;
}


// Fungsi untuk menghapus antrian dari database
async function deleteQueueWhatsapp(id) {
    await pool.query('DELETE FROM queue_whatsapps WHERE id = $1', [id]);
}


consumeQueueWhatsapp();

client.initialize();
