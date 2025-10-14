import AgentReportForm from "../../forms/AgentReportForm/AgentReportForm";

const AgentReportPage = () => {
  return (
    <div className="flex h-full flex-grow ">
      <div className=" h-full w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
        <AgentReportForm />
      </div>
    </div>
  );
};

export default AgentReportPage;
