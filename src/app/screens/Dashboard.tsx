import { useEffect, useState } from "react";
import { Header } from "@/app/components/Header";
import { PlantHero, PlantState } from "@/app/components/PlantHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { Badge } from "@/app/components/ui/badge";
import { Switch } from "@/app/components/ui/switch";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Droplets, RefreshCw, Thermometer, Wind, Activity, Wifi, WifiOff, Clock, AlertTriangle, Sprout } from "lucide-react";
import { useTheme } from "@/app/contexts/ThemeContext";

interface SensorData {
  leafTemp: number;
  leafHumidity: number;
  airTemp: number;
  airHumidity: number;
  soilMoisture: number;
  objectDetected: boolean;
  psi: number;
  plantState: PlantState;
  deltaT: number;
  pumpRunning: boolean;
  autoMode: boolean;
}

interface PSIData {
  psi: number;
  plantState: PlantState;
  leafTemp: number;
  airTemp: number;
  deltaT: number;
  deltaT_max: number;
  tempStress: number;
  airRHStress: number;
  soilStress: number;
  airHumidity: number;
  optimalRH: number;
  soilMoisture: number;
  optimalSM: number;
  w1: number;
  w2: number;
  w3: number;
  thresholds: {
    normal: number;
    stress_rising: number;
    stressed: number;
    critical: number;
    recovered: number;
  };
}

interface SensorHealth {
  leaf: {
    temp: number;
    humidity: number;
    reliable: boolean;
    average: number;
    stdDev: number;
    readingCount: number;
  };
  air: {
    temp: number;
    humidity: number;
    reliable: boolean;
    average: number;
    stdDev: number;
    readingCount: number;
  };
  soil: {
    moisture: number;
    reliable: boolean;
    average: number;
    stdDev: number;
    readingCount: number;
  };
  systemReliable: boolean;
  leafTrust: number;
  airTrust: number;
  soilTrust: number;
  alerts: Array<{
    sensor: string;
    message: string;
    severity: string;
    avgReading: number;
    stdDev: number;
  }>;
}

interface NextIrrigationData {
  nextIrrigationMillis: number;
  nextIrrigationClock: string;
  remainingHours: number;
  remainingMinutes: number;
  remainingSeconds: number;
}

export function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData>({
    leafTemp: 0,
    leafHumidity: 0,
    airTemp: 0,
    airHumidity: 0,
    soilMoisture: 0,
    objectDetected: false,
    psi: 0,
    plantState: "NORMAL",
    deltaT: 0,
    pumpRunning: false,
    autoMode: false,
  });

  const [psiData, setPsiData] = useState<PSIData | null>(null);
  const [sensorHealth, setSensorHealth] = useState<SensorHealth | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [showObject, setShowObject] = useState(false);
  const [nextIrrigation, setNextIrrigation] = useState<NextIrrigationData | null>(null);
  const { darkMode } = useTheme();

  // Settings state
  const [acres, setAcres] = useState(1.0);
  const [tankHeight, setTankHeight] = useState(1.0);
  const [plantType, setPlantType] = useState("tomato");
  const [psiThreshold, setPsiThreshold] = useState(0.6);

  const ESP32_IP = "http://10.185.62.40";

  // Fetch all sensor data from root endpoint
  const fetchSensorData = async () => {
    try {
      const res = await fetch(`${ESP32_IP}/`);
      if (res.ok) {
        const data = await res.json();
        setSensorData({
          leafTemp: data.leafTemp || 0,
          leafHumidity: data.leafHumidity || 0,
          airTemp: data.airTemp || 0,
          airHumidity: data.airHumidity || 0,
          soilMoisture: data.soilMoisture || 0,
          objectDetected: data.objectDetected || false,
          psi: data.psi || 0,
          plantState: data.plantState || "NORMAL",
          deltaT: data.deltaT || 0,
          pumpRunning: data.pumpRunning || false,
          autoMode: data.autoMode || false,
        });
        setIsOnline(true);
        setShowObject(data.objectDetected || false);
      } else {
        setIsOnline(false);
      }
    } catch (err) {
      console.error("Could not fetch sensor data", err);
      setIsOnline(false);
    }
  };

  // Fetch detailed PSI data
  const fetchPSIData = async () => {
    try {
      const res = await fetch(`${ESP32_IP}/psi`);
      if (res.ok) {
        const data = await res.json();
        setPsiData(data);
      }
    } catch (err) {
      console.error("Could not fetch PSI data", err);
    }
  };

  // Fetch sensor health/reliability
  const fetchSensorHealth = async () => {
    try {
      const res = await fetch(`${ESP32_IP}/sensorCheck`);
      if (res.ok) {
        const data = await res.json();
        setSensorHealth(data);
      }
    } catch (err) {
      console.error("Could not fetch sensor health", err);
    }
  };

  // Fetch next irrigation time
  const fetchNextIrrigation = async () => {
    try {
      const res = await fetch(`${ESP32_IP}/next`);
      if (res.ok) {
        const data = await res.json();
        setNextIrrigation(data);
      }
    } catch (err) {
      console.error("Could not fetch next irrigation", err);
    }
  };

  // Submit settings to ESP32
  const submitSettings = async () => {
    try {
      const res = await fetch(`${ESP32_IP}/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          acres,
          tankHeight,
          plantType,
          psiThreshold,
        }),
      });
      
      if (res.ok) {
        const message = await res.text();
        alert(message);
        // Refresh data after settings update
        fetchSensorData();
        fetchPSIData();
        fetchNextIrrigation();
      } else {
        alert("Failed to update settings");
      }
    } catch (err) {
      console.error("Could not submit settings", err);
      alert("Error submitting settings");
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchSensorData();
    fetchPSIData();
    fetchSensorHealth();
    fetchNextIrrigation();
  }, []);

  // Polling intervals
  useEffect(() => {
    const sensorInterval = setInterval(fetchSensorData, 2000); // Every 2 seconds
    const psiInterval = setInterval(fetchPSIData, 5000); // Every 5 seconds
    const healthInterval = setInterval(fetchSensorHealth, 10000); // Every 10 seconds
    const nextInterval = setInterval(fetchNextIrrigation, 1000); // Every second

    return () => {
      clearInterval(sensorInterval);
      clearInterval(psiInterval);
      clearInterval(healthInterval);
      clearInterval(nextInterval);
    };
  }, []);

  const psiPercentage = sensorData.psi * 100;

  const plantTypes = [
    "cotton", "groundnut", "soybean", "tomato", "potato", 
    "banana", "grapes", "rice", "wheat"
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#1A1A1A]" : "bg-[#FAFAFA]"}`}>
      <Header title="STOMA Dashboard" />

      {/* Object Detection Alert */}
      {showObject && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-[#EF5350] text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in">
            <AlertTriangle className="w-5 h-5" />
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
                <PlantHero state={sensorData.plantState} size="large" />
              </div>
              
              <div className="flex-1 space-y-6 w-full">
                <div>
                  <h2 className={`text-xl font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} mb-2`}>
                    Plant State: {sensorData.plantState}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      className="text-sm px-4 py-2"
                      style={{
                        backgroundColor: sensorData.plantState === "NORMAL" || sensorData.plantState === "RECOVERED" ? "#66BB6A" : 
                                       sensorData.plantState === "STRESS_RISING" ? "#FFA726" :
                                       sensorData.plantState === "STRESSED" || sensorData.plantState === "CRITICAL" ? "#EF5350" :
                                       sensorData.plantState === "IRRIGATING" ? "#42A5F5" : "#9E9E9E",
                        color: "white"
                      }}
                    >
                      {sensorData.plantState}
                    </Badge>
                    {sensorData.pumpRunning && (
                      <Badge className="bg-[#42A5F5] text-white text-sm px-4 py-2">
                        PUMP RUNNING
                      </Badge>
                    )}
                    {sensorData.autoMode && (
                      <Badge className="bg-[#66BB6A] text-white text-sm px-4 py-2">
                        AUTO MODE
                      </Badge>
                    )}
                  </div>
                </div>

                {/* PSI Gauge */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className={`text-lg font-medium ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}`}>
                      Plant Stress Index (PSI)
                    </h3>
                    <span className={`text-sm font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#558B2F]"}`}>
                      {sensorData.psi.toFixed(3)}
                    </span>
                  </div>
                  <Progress 
                    value={psiPercentage} 
                    className="h-4"
                    style={{
                      background: "linear-gradient(to right, #66BB6A 0%, #FDD835 50%, #EF5350 100%)",
                    }}
                  />
                  <div className={`flex justify-between text-xs ${darkMode ? "text-[#66BB6A]" : "text-[#689F38]"} mt-1`}>
                    <span>Normal (0.0)</span>
                    <span>Threshold ({psiThreshold})</span>
                    <span>Critical (1.0)</span>
                  </div>
                </div>

                {/* Delta T Indicator */}
                {psiData && (
                  <div className="text-sm">
                    <p className={darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}>
                      ΔT: {sensorData.deltaT.toFixed(2)}°C / {psiData.deltaT_max}°C max
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connectivity Section */}
        <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
          <CardHeader>
            <CardTitle className={`${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} flex items-center gap-2`}>
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
              Connectivity & System Health
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
              <Badge className={isOnline ? "bg-[#66BB6A]" : "bg-[#9E9E9E]"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>

            {sensorHealth && (
              <div className="space-y-2">
                <p className={`text-sm font-medium ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}`}>
                  Sensor Reliability
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div className={`p-2 rounded ${darkMode ? "bg-[#3A3A3A]" : "bg-[#F1F8E9]"}`}>
                    <p className="text-xs">Leaf: {sensorHealth.leafTrust}%</p>
                    <Badge variant={sensorHealth.leaf.reliable ? "default" : "destructive"} className="text-xs mt-1">
                      {sensorHealth.leaf.reliable ? "OK" : "Alert"}
                    </Badge>
                  </div>
                  <div className={`p-2 rounded ${darkMode ? "bg-[#3A3A3A]" : "bg-[#F1F8E9]"}`}>
                    <p className="text-xs">Air: {sensorHealth.airTrust}%</p>
                    <Badge variant={sensorHealth.air.reliable ? "default" : "destructive"} className="text-xs mt-1">
                      {sensorHealth.air.reliable ? "OK" : "Alert"}
                    </Badge>
                  </div>
                  <div className={`p-2 rounded ${darkMode ? "bg-[#3A3A3A]" : "bg-[#F1F8E9]"}`}>
                    <p className="text-xs">Soil: {sensorHealth.soilTrust}%</p>
                    <Badge variant={sensorHealth.soil.reliable ? "default" : "destructive"} className="text-xs mt-1">
                      {sensorHealth.soil.reliable ? "OK" : "Alert"}
                    </Badge>
                  </div>
                </div>

                {sensorHealth.alerts.length > 0 && (
                  <div className={`p-3 rounded ${darkMode ? "bg-[#3A2A2A]" : "bg-[#FFEBEE]"}`}>
                    <p className={`text-sm font-medium ${darkMode ? "text-[#EF5350]" : "text-[#C62828]"} mb-2`}>
                      Sensor Alerts:
                    </p>
                    {sensorHealth.alerts.map((alert, idx) => (
                      <p key={idx} className={`text-xs ${darkMode ? "text-[#EF5350]" : "text-[#C62828]"}`}>
                        • {alert.message}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={() => {
                fetchSensorData();
                fetchPSIData();
                fetchSensorHealth();
                fetchNextIrrigation();
              }}
              className="w-full bg-[#66BB6A] hover:bg-[#558B2F] text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh All Data
            </Button>
          </CardContent>
        </Card>

        {/* Settings & Configuration */}
        <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
          <CardHeader>
            <CardTitle className={`${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} flex items-center gap-2`}>
              <Sprout className="w-5 h-5" />
              Irrigation Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className={darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}>Acres</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={acres}
                  onChange={(e) => setAcres(parseFloat(e.target.value))}
                  className={darkMode ? "bg-[#3A3A3A] border-[#4A4A4A]" : ""}
                />
              </div>
              <div>
                <Label className={darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}>Tank Height (m)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={tankHeight}
                  onChange={(e) => setTankHeight(parseFloat(e.target.value))}
                  className={darkMode ? "bg-[#3A3A3A] border-[#4A4A4A]" : ""}
                />
              </div>
              <div>
                <Label className={darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}>Plant Type</Label>
                <Select value={plantType} onValueChange={setPlantType}>
                  <SelectTrigger className={darkMode ? "bg-[#3A3A3A] border-[#4A4A4A]" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {plantTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className={darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}>PSI Threshold</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={psiThreshold}
                  onChange={(e) => setPsiThreshold(parseFloat(e.target.value))}
                  className={darkMode ? "bg-[#3A3A3A] border-[#4A4A4A]" : ""}
                />
              </div>
            </div>

            <Button
              onClick={submitSettings}
              className="w-full bg-[#66BB6A] hover:bg-[#558B2F] text-white"
              disabled={!isOnline}
            >
              Apply Settings & Start Auto Irrigation
            </Button>

            <p className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
              Note: Settings will trigger irrigation calculation and start auto mode if soil moisture is below optimal.
            </p>
          </CardContent>
        </Card>

        {/* Live Sensor Readings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
            <CardHeader className="pb-3">
              <CardTitle className={`${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} flex items-center gap-2 text-lg`}>
                <Thermometer className="w-5 h-5" />
                Leaf Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#66BB6A]">{sensorData.leafTemp.toFixed(1)}°C</div>
              <p className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} mt-1`}>
                Humidity: {sensorData.leafHumidity.toFixed(1)}%
              </p>
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
              <div className="text-4xl font-bold text-[#66BB6A]">{sensorData.airTemp.toFixed(1)}°C</div>
              <p className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} mt-1`}>
                Humidity: {sensorData.airHumidity.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
            <CardHeader className="pb-3">
              <CardTitle className={`${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} flex items-center gap-2 text-lg`}>
                <Droplets className="w-5 h-5" />
                Soil Moisture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#66BB6A]">{sensorData.soilMoisture}%</div>
              <p className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} mt-1`}>
                {psiData && `Optimal: ${psiData.optimalSM}%`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* PSI Component Breakdown */}
        {psiData && (
          <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
            <CardHeader>
              <CardTitle className={`${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} flex items-center gap-2`}>
                <Activity className="w-5 h-5" />
                PSI Component Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
                    Temperature Stress (weight: {psiData.w1})
                  </span>
                  <span className="text-sm font-semibold">{(psiData.tempStress * 100).toFixed(1)}%</span>
                </div>
                <Progress value={psiData.tempStress * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
                    Air Humidity Stress (weight: {psiData.w2})
                  </span>
                  <span className="text-sm font-semibold">{(psiData.airRHStress * 100).toFixed(1)}%</span>
                </div>
                <Progress value={psiData.airRHStress * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
                    Soil Moisture Stress (weight: {psiData.w3})
                  </span>
                  <span className="text-sm font-semibold">{(psiData.soilStress * 100).toFixed(1)}%</span>
                </div>
                <Progress value={psiData.soilStress * 100} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <p className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
                  Air RH: {psiData.airHumidity.toFixed(1)}% (Optimal: {psiData.optimalRH}%)
                </p>
                <p className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
                  Soil Moisture: {psiData.soilMoisture}% (Optimal: {psiData.optimalSM}%)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Irrigation Timer */}
        {nextIrrigation && (
          <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
            <CardHeader className="pb-3">
              <CardTitle className={`${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} flex items-center gap-2`}>
                <Clock className="w-5 h-5" />
                Next Scheduled Irrigation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#66BB6A]">
                {`${nextIrrigation.remainingHours.toString().padStart(2,'0')}h : ${nextIrrigation.remainingMinutes.toString().padStart(2,'0')}m : ${nextIrrigation.remainingSeconds.toString().padStart(2,'0')}s`}
              </div>
              <p className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} mt-2`}>
                Countdown to next automatic irrigation cycle
              </p>
              <p className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} mt-1`}>
                Scheduled time: {nextIrrigation.nextIrrigationClock}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
