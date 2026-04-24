import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'invoice_number', label: 'Invoice #' },
  { key: 'customer_id', label: 'Customer ID' },
  { key: 'total_amount', label: 'Amount', type: 'currency' },
  { key: 'issue_date', label: 'Issued', type: 'date' },
  { key: 'due_date', label: 'Due', type: 'date' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'invoice_number', label: 'Invoice Number', placeholder: 'INV-2024-001' },
  { key: 'customer_id', label: 'Customer ID', type: 'number' },
  { key: 'job_id', label: 'Job ID', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['draft', 'sent', 'paid', 'overdue', 'partial', 'cancelled', 'refunded'] },
  { key: 'issue_date', label: 'Issue Date', type: 'date' },
  { key: 'due_date', label: 'Due Date', type: 'date' },
  { key: 'subtotal', label: 'Subtotal', type: 'number', placeholder: '0.00' },
  { key: 'discount_amount', label: 'Discount', type: 'number', placeholder: '0.00' },
  { key: 'tax_rate', label: 'Tax Rate %', type: 'number', placeholder: '8.25' },
  { key: 'tax_amount', label: 'Tax Amount', type: 'number', placeholder: '0.00' },
  { key: 'total_amount', label: 'Total Amount', type: 'number', placeholder: '0.00' },
  { key: 'amount_paid', label: 'Amount Paid', type: 'number', placeholder: '0.00' },
  { key: 'payment_method', label: 'Payment Method', type: 'select', options: ['Cash', 'Check', 'Credit Card', 'ACH', 'Venmo', 'Zelle', 'Other'] },
  { key: 'payment_date', label: 'Payment Date', type: 'date' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function Invoices() {
  return (
    <GenericFeature
      title="Invoicing & Payments"
      icon="💰"
      apiEndpoint="/invoices"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Invoices;
