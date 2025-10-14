import NumberOfOrdersChart from "../../charts/NumberOfOrdersChart";
import GrossMerchandiseValueChart from "../../charts/GrossMerchandiseValueChart";
import Nbrcustomerchart from "../../charts/Nbrcustomerchart";

const Dashboard = () => {
  return (
    <div className="mt-[4.8rem] w-full bg-n20 p-4">
      <div className="flex flex-col gap-[5px]">
        <GrossMerchandiseValueChart />
        <NumberOfOrdersChart />

        <Nbrcustomerchart />
      </div>
    </div>
  );
};

export default Dashboard;
