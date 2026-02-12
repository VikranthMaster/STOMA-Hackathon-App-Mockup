import { useEffect, useState } from "react";
import { Header } from "@/app/components/Header";
import { PlantHero, PlantState } from "@/app/components/PlantHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { Badge } from "@/app/components/ui/badge";
import { Switch } from "@/app/components/ui/switch";
import { Label } from "@/app/components/ui/label";
import { Droplets, RefreshCw, Power, Thermometer, Wind, Activity, Wifi, WifiOff } from "lucide-react";
import { useTheme } from "@/app/contexts/ThemeContext";


export function Dashboard() {
  const [plantState, setPlantState] = useState<PlantState>("NORMAL");
  const [isOnline, setIsOnline] = useState(false);
  const [autoIrrigation, setAutoIrrigation] = useState(true);
  const [forceIrrigation, setForceIrrigation] = useState(false);
  const { darkMode } = useTheme();

  const [leafTemp, setleafTemp] = useState(0);
  const [airTemp, setairTemp] = useState(0);

  const [showObject, setshowObject] = useState(false);
  
  const psiValue = plantState === "NORMAL" ? 0.3 : plantState === "STRESS_RISING" ? 0.6 : plantState === "STRESSED" ? 0.85 : 0.2;
  const psiPercentage = psiValue * 100;
  
  const ESP32_IP = "http://10.185.62.40";

  const send = async (path:string)=>{
    try {
      const res = await fetch(`${ESP32_IP}/${path}`);
      console.log(res);
      if (res.status == 200) {
        console.log("ESP32 synced")
        setIsOnline(true);
        Leafvitals();
        Airvitals();
      } else {
        console.log("ESP32 not in range")
      }
    } catch (err) {
      // console.error("ESP32 Not Reachable", err);
      console.log("NOT REACHABLE");
    }
  }


  const Leafvitals = async () => {
    try {
      const res = await fetch(`${ESP32_IP}/leaf`);
      const data = await res.json();
      setleafTemp(data.temperature);
      console.log(data);
    } catch (err) {
      console.log("Couldnt get vitals", err);
    }
  };

  const Airvitals = async () => {
    try {
      const res = await fetch(`${ESP32_IP}/air`);
      const data = await res.json();
      setairTemp(data.temperature);
      console.log(data);
    } catch (err) {
      console.log("Couldnt get vitals", err);
    }
  }

  useEffect(() => {
    Leafvitals();
    Airvitals();
  }, [])

  setInterval(async () => {
    const res = await fetch(`${ESP32_IP}/ir`);
    const data = await res.json();
    if (data.objectDetected) {
      console.log("🚨 Object detected!");
      setshowObject(true);
    }
    setshowObject(false);
  }, 1000);


  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#1A1A1A]" : "bg-[#FAFAFA]"}`}>
      <Header title="STOMA Dashboard" />

      {showObject && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-[#EF5350] text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in">
            🚨 Object Detected Near Plant!
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Plant Hero and State */}
        <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <PlantHero state={plantState} size="large" />
              </div>
              
              <div className="flex-1 space-y-6 w-full">
                <div>
                  <h2 className={`text-xl font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} mb-2`}>Plant State</h2>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={plantState === "NORMAL" ? "default" : "outline"}
                      className="cursor-pointer text-sm px-4 py-2"
                      style={{
                        backgroundColor: plantState === "NORMAL" ? "#66BB6A" : "transparent",
                        color: plantState === "NORMAL" && darkMode ? "white" : plantState === "NORMAL" ? "white" : "inherit"
                      }}
                      onClick={() => setPlantState("NORMAL")}
                    >
                      NORMAL
                    </Badge>
                    <Badge
                      variant={plantState === "STRESS_RISING" ? "default" : "outline"}
                      className="cursor-pointer text-sm px-4 py-2"
                      style={{
                        backgroundColor: plantState === "STRESS_RISING" ? "#FFA726" : "transparent",
                        color: plantState === "STRESS_RISING" && darkMode ? "white" : plantState === "STRESS_RISING" ? "white" : "inherit"
                      }}
                      onClick={() => setPlantState("STRESS_RISING")}
                    >
                      STRESS RISING
                    </Badge>
                    <Badge
                      variant={plantState === "STRESSED" ? "default" : "outline"}
                      className="cursor-pointer text-sm px-4 py-2"
                      style={{
                        backgroundColor: plantState === "STRESSED" ? "#EF5350" : "transparent",
                        color: plantState === "STRESSED" && darkMode ? "white" : plantState === "STRESSED" ? "white" : "inherit"
                      }}
                      onClick={() => setPlantState("STRESSED")}
                    >
                      STRESSED
                    </Badge>
                    <Badge
                      variant={plantState === "IRRIGATING" ? "default" : "outline"}
                      className="cursor-pointer text-sm px-4 py-2"
                      style={{
                        backgroundColor: plantState === "IRRIGATING" ? "#42A5F5" : "transparent",
                        color: plantState === "IRRIGATING" && darkMode ? "white" : plantState === "IRRIGATING" ? "white" : "inherit"
                      }}
                      onClick={() => setPlantState("IRRIGATING")}
                    >
                      IRRIGATING
                    </Badge>
                    <Badge
                      variant={plantState === "RECOVERED" ? "default" : "outline"}
                      className="cursor-pointer text-sm px-4 py-2"
                      style={{
                        backgroundColor: plantState === "RECOVERED" ? "#66BB6A" : "transparent",
                        color: plantState === "RECOVERED" && darkMode ? "white" : plantState === "RECOVERED" ? "white" : "inherit"
                      }}
                      onClick={() => setPlantState("RECOVERED")}
                    >
                      RECOVERED
                    </Badge>
                  </div>
                </div>

                {/* PSI Gauge */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className={`text-lg font-medium ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}`}>PSI Gauge</h3>
                    <span className={`text-sm font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#558B2F]"}`}>{psiValue.toFixed(2)}</span>
                  </div>
                  <Progress 
                    value={psiPercentage} 
                    className="h-4"
                    style={{
                      background: "linear-gradient(to right, #66BB6A 0%, #FDD835 50%, #EF5350 100%)",
                    }}
                  />
                  <div className={`flex justify-between text-xs ${darkMode ? "text-[#66BB6A]" : "text-[#689F38]"} mt-1`}>
                    <span>Normal</span>
                    <span>Threshold</span>
                    <span>Critical</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connectivity Section - Full Version */}
        <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
          <CardHeader>
            <CardTitle className={`${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} flex items-center gap-2`}>
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
              Connectivity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}`}>Device Status</p>
                <p className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
                  {isOnline ? "Connected to STOMA device" : "Operating in offline mode"}
                </p>
              </div>
              <Badge 
                className={isOnline ? "bg-[#66BB6A]" : "bg-[#9E9E9E]"}
              >
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>

            <Button
              onClick={() => send("")}
              disabled={isOnline}
              className="w-full bg-[#66BB6A] hover:bg-[#558B2F] text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Now
            </Button>

            <p className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
              Last synced: 2 minutes ago
            </p>
          </CardContent>
        </Card>

        {/* Irrigation Control Section - Full Version */}
        <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
          <CardHeader>
            <CardTitle className={`${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} flex items-center gap-2`}>
              <Droplets className="w-5 h-5" />
              Irrigation Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`flex items-center justify-between p-4 ${darkMode ? "bg-[#3A3A3A]" : "bg-[#F1F8E9]"} rounded-lg`}>
              <div className="space-y-1">
                <Label htmlFor="auto-irrigation" className={`${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} font-medium`}>
                  Automatic Irrigation
                </Label>
                <p className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
                  Let STOMA decide when to irrigate based on PSI
                </p>
              </div>
              <Switch
                id="auto-irrigation"
                checked={autoIrrigation}
                onCheckedChange={setAutoIrrigation}
              />
            </div>

            <div className={`flex items-center justify-between p-4 ${darkMode ? "bg-[#3A3A3A]" : "bg-[#FFF3E0]"} rounded-lg border-2 ${darkMode ? "border-[#FFB74D]" : "border-[#FFB74D]"}`}>
              <div className="space-y-1">
                <Label htmlFor="force-irrigation" className={`${darkMode ? "text-[#FFB74D]" : "text-[#E65100]"} font-medium`}>
                  Force Irrigation
                </Label>
                <p className={`text-sm ${darkMode ? "text-[#FFB74D]" : "text-[#F57C00]"}`}>
                  Manually start irrigation regardless of PSI
                </p>
              </div>
              <Switch
                id="force-irrigation"
                checked={forceIrrigation}
                onCheckedChange={setForceIrrigation}
              />
            </div>

            {forceIrrigation && (
              <div className={`p-4 ${darkMode ? "bg-[#3A2A2A]" : "bg-[#FFEBEE]"} rounded-lg ${darkMode ? "border border-[#EF5350]" : "border border-[#EF5350]"}`}>
                <p className={`text-sm font-medium ${darkMode ? "text-[#EF5350]" : "text-[#C62828]"}`}>
                  ⚠️ Warning: Manual irrigation is active. STOMA's automatic decisions are overridden.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className={`${darkMode ? "border-[#66BB6A] text-[#66BB6A] hover:bg-[#3A3A3A]" : "border-[#66BB6A] text-[#66BB6A] hover:bg-[#E8F5E9]"}`}
                onClick={() => {
                  setForceIrrigation(true);
                  alert("Irrigation started manually");
                }}
              >
                Start Irrigation
              </Button>
              <Button
                variant="outline"
                className={`${darkMode ? "border-[#EF5350] text-[#EF5350] hover:bg-[#3A3A3A]" : "border-[#EF5350] text-[#EF5350] hover:bg-[#FFEBEE]"}`}
                onClick={() => {
                  setForceIrrigation(false);
                  alert("Irrigation stopped");
                }}
              >
                Stop Irrigation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
            <CardHeader className="pb-3">
              <CardTitle className={`${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} flex items-center gap-2 text-lg`}>
                <Thermometer className="w-5 h-5" />
                Leaf Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#66BB6A]">{leafTemp}</div>
              <p className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} mt-1`}>Live</p>
            </CardContent>
          </Card>

          <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
            <CardHeader className="pb-3">
              <CardTitle className={`${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} flex items-center gap-2 text-lg`}>
                <Wind className="w-5 h-5" />
                Air Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#66BB6A]">{airTemp}</div>
              <p className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} mt-1`}>Live</p>
            </CardContent>
          </Card>

          <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
            <CardHeader className="pb-3">
              <CardTitle className={`${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} flex items-center gap-2 text-lg`}>
                <Activity className="w-5 h-5" />
                Computed PSI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#66BB6A]">{psiValue.toFixed(2)}</div>
              <p className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} mt-1`}>Computed</p>
            </CardContent>
          </Card>
        </div>

        {/* Water Usage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
            <CardHeader className="pb-3">
              <CardTitle className={`${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} flex items-center gap-2`}>
                <Droplets className="w-5 h-5" />
                Water Used Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#66BB6A]">24.5 L</div>
              <p className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} mt-1`}>12% less than yesterday</p>
            </CardContent>
          </Card>

          <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
            <CardHeader className="pb-3">
              <CardTitle className={`${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} flex items-center gap-2`}>
                <Activity className="w-5 h-5" />
                Estimated Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#66BB6A]">127 L</div>
              <p className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} mt-1`}>This month compared to traditional methods</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
