import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlayIcon, PencilIcon } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white px-10 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <Button variant="link" className="text-2xl font-bold p-0 h-auto">
          Test@Test.com
        </Button>
        <div className="flex gap-2">
          <Button variant="default">Create a Routine</Button>
          <Button variant="destructive">Logout</Button>
        </div>
      </div>

      {/* Griglia Automazioni */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <Card key={index} className="flex justify-between items-center">
            <CardContent className="p-1 flex flex-col justify-center">
              <p className="text-sm font-semibold">Automazione</p>
              <p className="text-sm text-gray-500">
                Questa automazione esegue....
              </p>
            </CardContent>
            <div className="flex gap-2 pr-2">
              <Button variant="ghost" size="icon">
                <PencilIcon className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <PlayIcon className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}