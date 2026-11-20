import TicketList from "../components/TicketList.jsx";

export default function AllTickets() {
  return (
    <TicketList
      title="All Doubts"
      endpoint="/tickets/all"
      showPeople={true}
    />
  );
}