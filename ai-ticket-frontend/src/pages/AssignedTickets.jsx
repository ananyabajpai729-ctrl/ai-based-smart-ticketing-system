import TicketList from "../components/TicketList.jsx";

export default function AssignedTickets() {
  return (
    <TicketList
      title="Doubts Assigned to Me"
      endpoint="/tickets/assigned"
    />
  );
}