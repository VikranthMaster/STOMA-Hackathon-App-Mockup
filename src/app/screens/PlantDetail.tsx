import { Header } from "@/app/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { TrendingUp, Leaf, Wind, Mountain, Clock, AlertTriangle } from "lucide-react";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useEffect, useState } from "react";

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
    avgReading?: number;
    stdDev?: number;
  }>;
}

export function PlantDetail() {
  const { darkMode } = useTheme();

  // Sensor state from backend
  const [sensorHealth, setSensorHealth] = useState<SensorHealth | null>(null);
  const ESP32_IP = "http://10.185.62.40";

  useEffect(() => {
    const fetchSensorStatus = async () => {
      try {
        const res = await fetch(`${ESP32_IP}/sensorCheck`);
        if (res.ok) {
          const data = await res.json();
          setSensorHealth(data);
          console.log("Sensor Health:", data);
        }
      } catch (err) {
        console.error("Failed to fetch sensor status", err);
      }
    };

    fetchSensorStatus();
    const interval = setInterval(fetchSensorStatus, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Mock chart data (unchanged)
  const stressData = [
    { time: "00:00", psi: 0.2 },
    { time: "04:00", psi: 0.3 },
    { time: "08:00", psi: 0.5 },
    { time: "12:00", psi: 0.7 },
    { time: "16:00", psi: 0.6 },
    { time: "20:00", psi: 0.4 },
  ];

  const psiData = [
    { time: "00:00", leafTemp: 22, airTemp: 20, psi: 0.2 },
    { time: "04:00", leafTemp: 21, airTemp: 19, psi: 0.3 },
    { time: "08:00", leafTemp: 24, airTemp: 22, psi: 0.5 },
    { time: "12:00", leafTemp: 28, airTemp: 26, psi: 0.7 },
    { time: "16:00", leafTemp: 27, airTemp: 25, psi: 0.6 },
    { time: "20:00", leafTemp: 23, airTemp: 21, psi: 0.4 },
  ];

  const decisionLog = [
    { time: "14:32", event: "Irrigation Started", reason: "PSI threshold exceeded (0.75)" },
    { time: "12:15", event: "Stress Rising Detected", reason: "Leaf temp 2°C above air temp" },
    { time: "09:00", event: "System Online", reason: "Daily check completed" },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#1A1A1A]" : "bg-[#FAFAFA]"}`}>
      <Header title="Plant Detail Analysis" showBackButton={true} />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* PSI Trend Chart */}
        <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
          <CardHeader>
            <CardTitle className={`${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} flex items-center gap-2`}>
              <TrendingUp className="w-5 h-5" />
              PSI Trend (24 Hours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stressData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#3A3A3A" : "#E0E0E0"} />
                <XAxis dataKey="time" stroke={darkMode ? "#66BB6A" : "#2E7D32"} />
                <YAxis stroke={darkMode ? "#66BB6A" : "#2E7D32"} domain={[0, 1]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? "#2A2A2A" : "#FFFFFF",
                    border: `1px solid ${darkMode ? "#3A3A3A" : "#E8F5E9"}`,
                    color: darkMode ? "#66BB6A" : "#2E7D32"
                  }}
                />
                <Legend />
                <ReferenceLine y={0.6} stroke="#EF5350" strokeDasharray="3 3" label="Critical" />
                <ReferenceLine y={0.25} stroke="#FFA726" strokeDasharray="3 3" label="Warning" />
                <Line type="monotone" dataKey="psi" stroke="#66BB6A" strokeWidth={2} dot={{ fill: "#66BB6A" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Temperature vs PSI Chart */}
        <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
          <CardHeader>
            <CardTitle className={`${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} flex items-center gap-2`}>
              <Leaf className="w-5 h-5" />
              Temperature Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={psiData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#3A3A3A" : "#E0E0E0"} />
                <XAxis dataKey="time" stroke={darkMode ? "#66BB6A" : "#2E7D32"} />
                <YAxis stroke={darkMode ? "#66BB6A" : "#2E7D32"} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? "#2A2A2A" : "#FFFFFF",
                    border: `1px solid ${darkMode ? "#3A3A3A" : "#E8F5E9"}`,
                    color: darkMode ? "#66BB6A" : "#2E7D32"
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="leafTemp" stroke="#66BB6A" strokeWidth={2} name="Leaf Temp" />
                <Line type="monotone" dataKey="airTemp" stroke="#42A5F5" strokeWidth={2} name="Air Temp" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Alerts */}
        {sensorHealth && sensorHealth.alerts.length > 0 && (
          <Card className={`${darkMode ? "bg-[#3A2A2A] border-[#EF5350]" : "bg-[#FFEBEE] border-[#EF5350]"} shadow-md border-2`}>
            <CardHeader>
              <CardTitle className={`${darkMode ? "text-[#EF5350]" : "text-[#C62828]"} flex items-center gap-2`}>
                <AlertTriangle className="w-5 h-5" />
                Active Sensor Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sensorHealth.alerts.map((alert, idx) => (
                <div key={idx} className={`p-3 rounded ${darkMode ? "bg-[#2A2A2A]" : "bg-white"} border ${darkMode ? "border-[#4A4A4A]" : "border-[#FFCDD2]"}`}>
                  <div className="flex items-start gap-3">
                    <Badge className="bg-[#EF5350] text-white">
                      {alert.sensor.toUpperCase()}
                    </Badge>
                    <div className="flex-1">
                      <p className={`font-medium ${darkMode ? "text-[#EF5350]" : "text-[#C62828]"}`}>
                        {alert.message}
                      </p>
                      {alert.avgReading !== undefined && (
                        <p className={`text-sm mt-1 ${darkMode ? "text-[#A0A0A0]" : "text-[#666]"}`}>
                          Average: {alert.avgReading.toFixed(2)} | Std Dev: {alert.stdDev?.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Sensor Health Monitor */}
        <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
          <CardHeader>
            <CardTitle className={`${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} flex items-center gap-2`}>
              <Clock className="w-5 h-5" />
              Real-Time Sensor Health
            </CardTitle>
          </CardHeader>

          <CardContent>
            {!sensorHealth ? (
              <div className="text-center py-10">
                <div className={`text-lg ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}`}>
                  Connecting to sensors...
                </div>
              </div>
            ) : (
              <>
                {/* System Status Banner */}
                <div className={`p-4 rounded-lg mb-6 ${
                  sensorHealth.systemReliable 
                    ? darkMode ? "bg-[#1B5E20]" : "bg-[#E8F5E9]" 
                    : darkMode ? "bg-[#B71C1C]" : "bg-[#FFEBEE]"
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-semibold text-lg ${
                        sensorHealth.systemReliable
                          ? darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"
                          : darkMode ? "text-[#EF5350]" : "text-[#C62828]"
                      }`}>
                        System Status
                      </h3>
                      <p className={`text-sm ${
                        sensorHealth.systemReliable
                          ? darkMode ? "text-[#81C784]" : "text-[#558B2F]"
                          : darkMode ? "text-[#EF9A9A]" : "text-[#D32F2F]"
                      }`}>
                        {sensorHealth.systemReliable 
                          ? "All sensors operational" 
                          : "Sensor anomalies detected"}
                      </p>
                    </div>
                    <Badge className={
                      sensorHealth.systemReliable 
                        ? "bg-[#66BB6A] text-white" 
                        : "bg-[#EF5350] text-white"
                    }>
                      {sensorHealth.systemReliable ? "HEALTHY" : "ALERT"}
                    </Badge>
                  </div>
                </div>

                {/* Sensor Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Leaf Sensor */}
                  <SensorCard
                    title="Leaf Sensor"
                    icon={<Leaf className="w-5 h-5 text-white" />}
                    trust={sensorHealth.leafTrust}
                    reliable={sensorHealth.leaf.reliable}
                    temperature={sensorHealth.leaf.temp}
                    humidity={sensorHealth.leaf.humidity}
                    average={sensorHealth.leaf.average}
                    stdDev={sensorHealth.leaf.stdDev}
                    readingCount={sensorHealth.leaf.readingCount}
                    darkMode={darkMode}
                  />

                  {/* Air Sensor */}
                  <SensorCard
                    title="Air Sensor"
                    icon={<Wind className="w-5 h-5 text-white" />}
                    trust={sensorHealth.airTrust}
                    reliable={sensorHealth.air.reliable}
                    temperature={sensorHealth.air.temp}
                    humidity={sensorHealth.air.humidity}
                    average={sensorHealth.air.average}
                    stdDev={sensorHealth.air.stdDev}
                    readingCount={sensorHealth.air.readingCount}
                    darkMode={darkMode}
                  />

                  {/* Soil Sensor */}
                  <SensorCard
                    title="Soil Sensor"
                    icon={<Mountain className="w-5 h-5 text-white" />}
                    trust={sensorHealth.soilTrust}
                    reliable={sensorHealth.soil.reliable}
                    moisture={sensorHealth.soil.moisture}
                    average={sensorHealth.soil.average}
                    stdDev={sensorHealth.soil.stdDev}
                    readingCount={sensorHealth.soil.readingCount}
                    darkMode={darkMode}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Decision Log */}
        <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
          <CardHeader>
            <CardTitle className={darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}>
              System Decision Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {decisionLog.map((log, idx) => (
                <div
                  key={idx}
                  className={`flex gap-4 p-3 rounded-lg ${
                    darkMode ? "bg-[#3A3A3A]" : "bg-[#F1F8E9]"
                  }`}
                >
                  <div className={`text-sm font-mono ${darkMode ? "text-[#66BB6A]" : "text-[#558B2F]"} w-16`}>
                    {log.time}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}`}>
                      {log.event}
                    </p>
                    <p className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
                      {log.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Sensor Card Component
interface SensorCardProps {
  title: string;
  icon: React.ReactNode;
  trust: number;
  reliable: boolean;
  temperature?: number;
  humidity?: number;
  moisture?: number;
  average: number;
  stdDev: number;
  readingCount: number;
  darkMode: boolean;
}

function SensorCard({ 
  title, 
  icon, 
  trust, 
  reliable, 
  temperature, 
  humidity, 
  moisture,
  average, 
  stdDev, 
  readingCount,
  darkMode 
}: SensorCardProps) {
  const isHealthy = reliable;

  return (
    <div className={`p-4 ${darkMode ? "bg-[#3A3A3A]" : "bg-[#F1F8E9]"} rounded-lg border ${
      isHealthy 
        ? darkMode ? "border-[#66BB6A]" : "border-[#C5E1A5]"
        : darkMode ? "border-[#EF5350]" : "border-[#FFCDD2]"
    } ${isHealthy ? "" : "ring-2 ring-red-500 ring-opacity-50"}`}>
      
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-full ${isHealthy ? "bg-[#66BB6A]" : "bg-[#EF5350]"}`}>
          {icon}
        </div>
        <div>
          <h3 className={`font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}`}>
            {title}
          </h3>
          <p className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
            {readingCount} readings collected
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
            Trust Level
          </span>
          <span className={`text-2xl font-bold ${isHealthy ? "text-[#66BB6A]" : "text-[#EF5350]"}`}>
            {trust}%
          </span>
        </div>

        <Progress value={trust} className="h-2" />

        <Badge className={
          isHealthy 
            ? "bg-[#E8F5E9] text-[#2E7D32]" 
            : "bg-[#FFEBEE] text-[#C62828]"
        }>
          {isHealthy ? "HEALTHY" : "FAULT DETECTED"}
        </Badge>

        <div className={`pt-3 border-t ${darkMode ? "border-[#4A4A4A]" : "border-[#C5E1A5]"} space-y-2`}>
          <p className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
            <span className="font-semibold">Status:</span> {isHealthy ? "Operating normally" : "Anomaly detected"}
          </p>
          
          {temperature !== undefined && (
            <p className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
              <span className="font-semibold">Temp:</span> {temperature.toFixed(1)}°C
              {humidity !== undefined && ` | Humidity: ${humidity.toFixed(1)}%`}
            </p>
          )}
          
          {moisture !== undefined && (
            <p className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
              <span className="font-semibold">Moisture:</span> {moisture}%
            </p>
          )}
          
          <p className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
            <span className="font-semibold">Avg:</span> {average.toFixed(2)} | 
            <span className="font-semibold"> σ:</span> {stdDev.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
