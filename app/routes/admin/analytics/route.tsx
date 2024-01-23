import { User } from "@prisma/client";
import { useOutletContext } from "@remix-run/react";

import { Link } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LineChart, Line } from "recharts";
import {
  CardDescription,
  CardTitle,
  CardHeader,
  CardContent,
  Card,
  CardFooter,
} from "@/components/ui/card";

export default function Analytics() {
  const contextdata: User = useOutletContext();

  const data = [
    { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 300, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 200, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 278, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 189, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 239, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 349, pv: 4300, amt: 2100 },
  ];

  // console.log(contextdata);

  return (
    <div className="flex flex-col w-full ">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] bg-gray-100/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
        <div className="max-w-6xl w-full mx-auto grid gap-2">
          <h1 className="font-semibold text-3xl">Web Analytics</h1>
          <div className="flex flex-row items-center text-sm gap-2">
            <Separator className="h-5" orientation="vertical" />
            <div className="  text-gray-500 flex items-center gap-2 dark:text-gray-400">
              <span className="inline-block w-2 h-2 bg-[#09CE6B] rounded-full animate-ping duration-[5000]" />
              32 users online
            </div>
          </div>
        </div>
        {/* <LineChart width={400} height={400} data={data}>
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        </LineChart> */}
        <div className="grid gap-6 max-w-6xl w-full mx-auto">
          <div className="flex gap-3">
            <Card className="p-0 overflow-hidden w-[300px]">
              <CardHeader>
                <CardDescription className="text-sm font-medium">
                  Visitors
                </CardDescription>
                <CardTitle className="text-2xl">2,389,098</CardTitle>
              </CardHeader>
              <CardContent>
                {/* <FilledtimeseriesChart className="aspect-[9/4]" /> */}
              </CardContent>
            </Card>
            <Card className="p-0 overflow-hidden w-[300px]">
              <CardHeader>
                <CardDescription className="text-sm font-medium">
                  Total Resumes
                </CardDescription>
                <CardTitle className="text-2xl">23</CardTitle>
              </CardHeader>
              <CardContent>
                {/* <FilledtimeseriesChart className="aspect-[9/4]" /> */}
              </CardContent>
            </Card>
            <Card className="p-0 overflow-hidden w-[300px]">
              <CardHeader>
                <CardDescription className="text-sm font-medium">
                  Total Templates
                </CardDescription>
                <CardTitle className="text-2xl">233</CardTitle>
              </CardHeader>
              <CardContent>
                {/* <FilledtimeseriesChart className="aspect-[9/4]" /> */}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center border-b">
                <CardTitle>Top Pages</CardTitle>
                <CardDescription className="ml-auto">Visitors</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 text-sm p-6">
                <div className="flex items-center">
                  <div>/</div>
                  <div className="font-semibold ml-auto">5.4K</div>
                </div>
                <div className="flex items-center">
                  <div>/about</div>
                  <div className="font-semibold ml-auto">2.2K</div>
                </div>
                <div className="flex items-center">
                  <div>/pricing</div>
                  <div className="font-semibold ml-auto">2K</div>
                </div>
                <div className="flex items-center">
                  <div>/about/contact</div>
                  <div className="font-semibold ml-auto">1.1K</div>
                </div>
                <div className="flex items-center">
                  <div>/pricing/enterprise</div>
                  <div className="font-semibold ml-auto">1K</div>
                </div>
              </CardContent>
              <CardFooter className="pb-4 px-6 justify-center bg-gradient-to-b from-background/50 to-background absolute inset-x-0 bottom-0">
                <Button
                  className="gap-2 rounded-full bg-white dark:bg-gray-950"
                  size="sm"
                  variant="outline"
                >
                  View All
                </Button>
              </CardFooter>
            </Card>
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center border-b">
                <CardTitle>Top Referrers</CardTitle>
                <CardDescription className="ml-auto">Visitors</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 text-sm p-6">
                <div className="flex items-center">
                  <div>google.com</div>
                  <div className="font-semibold ml-auto">3K</div>
                </div>
                <div className="flex items-center">
                  <div>twitter.com</div>
                  <div className="font-semibold ml-auto">1.2K</div>
                </div>
                <div className="flex items-center">
                  <div>youtube.com</div>
                  <div className="font-semibold ml-auto">1.1K</div>
                </div>
                <div className="flex items-center">
                  <div>facebook.com</div>
                  <div className="font-semibold ml-auto">1K</div>
                </div>
                <div className="flex items-center">
                  <div>github.com</div>
                  <div className="font-semibold ml-auto">1K</div>
                </div>
              </CardContent>
              <CardFooter className="pb-4 px-6 justify-center bg-gradient-to-b from-background/50 to-background absolute inset-x-0 bottom-0">
                <Button
                  className="gap-2 rounded-full bg-white dark:bg-gray-950"
                  size="sm"
                  variant="outline"
                >
                  View All
                </Button>
              </CardFooter>
            </Card>
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center border-b">
                <CardTitle>Browsers</CardTitle>
                <CardDescription className="ml-auto">Visitors</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 text-sm p-6">
                <div className="flex items-center">
                  <div>Google Chrome</div>
                  <div className="font-semibold ml-auto">1.3K</div>
                </div>
                <div className="flex items-center">
                  <div>Microsoft Edge</div>
                  <div className="font-semibold ml-auto">1.2K</div>
                </div>
                <div className="flex items-center">
                  <div>Mobile Safari</div>
                  <div className="font-semibold ml-auto">1.1K</div>
                </div>
                <div className="flex items-center">
                  <div>Firefox</div>
                  <div className="font-semibold ml-auto">1K</div>
                </div>
                <div className="flex items-center">
                  <div>Safari</div>
                  <div className="font-semibold ml-auto">1K</div>
                </div>
              </CardContent>
              <CardFooter className="pb-4 px-6 justify-center bg-gradient-to-b from-background/50 to-background absolute inset-x-0 bottom-0">
                <Button
                  className="gap-2 rounded-full bg-white dark:bg-gray-950"
                  size="sm"
                  variant="outline"
                >
                  View All
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
