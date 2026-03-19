export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);
 
    socket.on("join", (data) => {
      if (data.role) {
        socket.join(data.role);
        console.log(`[Socket] ${socket.id} joined room: ${data.role}`);
      }
      if (data.table_id) {
        socket.join(`table_${data.table_id}`);
        console.log(`[Socket] ${socket.id} joined table room: table_${data.table_id}`);
      }
    });
  
    socket.on("callWaiter", (data) => {
      io.to("Waiter").emit("callWaiter", {
        table_id: data.table_id,
        session_id: data.session_id,
        message: `Table ${data.table_id} is calling for a waiter`,
      });
      console.log(`[Socket] callWaiter from table ${data.table_id}`);
    });
 
    socket.on("requestBill", (data) => {
      io.to("Cashier").emit("requestBill", {
        table_id: data.table_id,
        session_id: data.session_id,
        message: `Table ${data.table_id} is requesting the bill`,
      });
      console.log(`[Socket] requestBill from table ${data.table_id}`);
    });
 
    socket.on("disconnect", () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
};