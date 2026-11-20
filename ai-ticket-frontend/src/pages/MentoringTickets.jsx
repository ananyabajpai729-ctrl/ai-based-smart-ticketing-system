import TicketList from "../components/TicketList.jsx";

export default function MentoringTickets() {
  return (
    <TicketList
      title="My Mentoring Doubts"
      endpoint="/tickets/mentoring"
    />
  );
}