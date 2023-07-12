import { Card, CardContent, CardHeader, CardTitle } from "../UI/Card";
import HeatMap from "../charts/HeatMap";
import PieChart from "../charts/PieChart";
import TreeMap from "../charts/TreeMap";

const Analytics = () => {
  return (
    <div className="grid grid-cols-6 gap-x-16 gap-y-4">
      <Card className="col-span-6">
        <CardHeader>
          <CardTitle>Daily Transaction Count</CardTitle>
        </CardHeader>
        <CardContent>
          <HeatMap />
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Payment Types</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart />
        </CardContent>
      </Card>
      <Card className="col-span-4 col-start-3">
        <CardHeader>
          <CardTitle>Top 10 Banks by Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <TreeMap />
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
