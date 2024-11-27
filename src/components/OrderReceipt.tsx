import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { Order } from '../types/order';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  orderInfo: {
    marginBottom: 20,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  total: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: 'grey',
  },
});

interface OrderReceiptProps {
  order: Order;
}

// Componente del recibo en PDF
const OrderReceipt: React.FC<OrderReceiptProps> = ({ order }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <PDFViewer style={{ width: '100%', height: '600px' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Encabezado */}
          <View style={styles.header}>
            <Text style={styles.title}>ModernShop</Text>
            <Text>Recibo de Compra</Text>
          </View>

          {/* Información de la orden */}
          <View style={styles.orderInfo}>
            <Text>Orden #{order.id}</Text>
            <Text>Fecha: {formatDate(order.createdAt)}</Text>
            <Text>Estado: {order.status}</Text>
          </View>

          {/* Información del cliente */}
          <View style={styles.section}>
            <Text>Cliente:</Text>
            <Text>{order.customerName}</Text>
            <Text>{order.customerEmail}</Text>
            <Text>{order.shippingAddress}</Text>
          </View>

          {/* Tabla de productos */}
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCell}>
                <Text>Producto</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Cantidad</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Precio Unit.</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Total</Text>
              </View>
            </View>

            {order.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text>{item.name}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item.quantity}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{formatCurrency(item.price)}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{formatCurrency(item.price * item.quantity)}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Totales */}
          <View style={styles.section}>
            <Text style={styles.total}>Subtotal: {formatCurrency(order.subtotal)}</Text>
            <Text style={styles.total}>IVA (19%): {formatCurrency(order.tax)}</Text>
            <Text style={styles.total}>Total: {formatCurrency(order.total)}</Text>
          </View>

          {/* Pie de página */}
          <View style={styles.footer}>
            <Text>Gracias por su compra - ModernShop</Text>
            <Text>Para cualquier consulta, contáctenos en support@modernshop.com</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default OrderReceipt;
