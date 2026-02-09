import { Download, Package, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";

const ArtistStats = () => {
  const stats = [
    {
      title: "Total Packs",
      value: 0,
      icon: Package,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Total Downloads",
      value: 0,
      icon: Download,
      color: "from-pink-500 to-pink-600",
    },
    {
      title: "Total Revenue",
      value: 0,
      icon: DollarSign,
      color: "from-green-500 to-green-600",
    },
  ];
  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="relative overflow-hidden border-purple-100 bg-white/80 backdrop-blur-sm"
          >
            <div
              className={`absolute top-0 right-0 h-32 w-32 bg-linear-to-br ${stat.color} translate-x-8 -translate-y-8 rounded-full opacity-10`}
            />
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <CardTitle className="mt-2 text-3xl font-bold">
                    {stat.value}
                  </CardTitle>
                </div>
                <div
                  className={`rounded-xl bg-linear-to-br p-3 ${stat.color} bg-opacity-20`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
};

export default ArtistStats;
