import { RouterOutputs } from "pergamos/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "../UI/Card";
import BarChart from "../charts/BarChart";
import PieChart from "../charts/PieChart";
import TreeMap from "../charts/TreeMap";

type Payment = RouterOutputs["payments"]["dashboard"]["analytics"];

const Analytics: React.FC<{ data: Payment }> = ({ data }) => {
  console.log(data.pieChart.cititeams);
  return (
    <div className="grid grid-cols-6 gap-x-16 gap-y-4">
      <Card className="col-span-6">
        <CardHeader className="pb-0">
          <CardTitle>Monthly Transaction Count</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <BarChart data={data.barChart} />
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Payment Type Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart data={data.pieChart} />
        </CardContent>
      </Card>
      <Card className="col-span-4 col-start-3">
        <CardHeader>
          <CardTitle>Top 10 Banks by Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <TreeMap data={data.treemap} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
