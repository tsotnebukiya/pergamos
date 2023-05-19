import { Card, CardContent, CardHeader, CardTitle } from "../UI/Card";

const BankDetails: React.FC<{
  cardClass1?: string;
  cardClass2?: string;
}> = ({ cardClass1, cardClass2 }) => {
  return (
    <>
      <Card className={cardClass1}>
        <CardHeader>
          <CardTitle>First Bank Details</CardTitle>
        </CardHeader>
        <CardContent>{/* <RecentSales /> */}</CardContent>
      </Card>

      <Card className={cardClass2}>
        <CardHeader>
          <CardTitle>Second Bank Details</CardTitle>
        </CardHeader>
        <CardContent>{/* <RecentSales /> */}</CardContent>
      </Card>
    </>
  );
};

export default BankDetails;
