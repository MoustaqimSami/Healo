import { NavLink, useParams } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { useClinicData, usePatient } from "../hooks/ClinicDataProvider";

export function PatientBillingPage() {
  const { patientId } = useParams();
  const patient = usePatient(patientId);
  const clinic = useClinicData();
  if (!patient) return null;
  const invoices = clinic.invoices.filter((i) => i.patientId === patient.id);
  const totalDue = invoices.reduce((sum, i) => sum + Math.max(0, i.amountDue - i.amountPaid), 0);
  return (
    <main className="page">
      <header className="page-header page-header--column"><div className="page-nav"><NavLink className="page-title page-title--outer" to="/patients">Patients /</NavLink><p className="page-title page-title--inner">{patient.name}</p></div><h1 className="page-title">{patient.name}</h1></header>
      <section className="page-body page-body--innerpage auto-height">
        <aside className="inner-sidebar"><nav className="inner-sidebar-nav"><NavLink className="inner-nav-item" to={`/patients/${patient.id}/profile`}>Profile</NavLink><NavLink className="inner-nav-item" to={`/patients/${patient.id}/appointments`}>Appointments</NavLink><NavLink className="inner-nav-item inner-nav-item-active" to={`/patients/${patient.id}/billing`}>Billing</NavLink></nav></aside>
        <div className="main main--innerpage flexcol-gap24">
          <h2 className="body-xl-semibold">Billing Overview</h2>
          <div className="bill-sum"><div className="sum-crd"><p className="sum-l">Total Due</p><p className="sum-v">${totalDue.toFixed(2)}</p><p className="sum-s">{invoices.filter((i) => i.status !== "Paid").length} unpaid dues</p></div><div className="sum-crd"><p className="sum-l">Insurance Type</p><p className="sum-v">{patient.extendedInfo.otherInsurance}</p><p className="sum-s">AHS: {patient.extendedInfo.healthcareNumber}</p></div></div>
          <div className="inv-hd"><h3 className="inv-t">Invoices</h3><button className="process-btn"><CreditCard size={16} /> Process Payment</button></div>
          <div className="inv-tbl-contain"><table className="inv-tbl"><thead><tr><th>Invoice Number</th><th>Service</th><th>Date</th><th>Amount Due</th><th>Amount Paid</th><th>Insurance</th><th>Status</th><th /></tr></thead><tbody>{invoices.map((invoice) => <tr key={invoice.id}><td>{invoice.invoiceNumber}</td><td>{invoice.service}</td><td>{invoice.date}</td><td>${invoice.amountDue}</td><td>${invoice.amountPaid}</td><td>{invoice.insuranceStatus}</td><td>{invoice.status}</td><td>{invoice.status !== "Paid" && <button className="btn btn--small" onClick={() => clinic.processPayment(invoice.id, invoice.amountDue - invoice.amountPaid)}>Pay balance</button>}</td></tr>)}</tbody></table></div>
        </div>
      </section>
    </main>
  );
}
