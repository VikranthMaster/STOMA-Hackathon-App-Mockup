import { useState } from "react";
import { Header } from "@/app/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { Settings as SettingsIcon } from "lucide-react";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

export function Settings() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [acres, setAcres] = useState("");
  const [tankHeight, setTankHeight] = useState("");
  const [plantType, setPlantType] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCalibration = () => {
    alert("Starting sensor calibration...");
  };

  const handleSaveSettings = async () => {
    setIsSending(true);

    try {
      const data = {
        acres: Number(acres),
        tankHeight: Number(tankHeight),
        plantType: plantType,
        psiThreshold: 0.7,
        irrigationDuration: 15,
      };

      const ESP32_IP = "http://10.185.62.40";
      const response = await fetch(`${ESP32_IP}/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("ESP32 did not accept data");
      }

      const result = await response.text();
      console.log(result);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        window.location.href = "/dashboard";
      }, 1500);
    } catch (error) {
      console.error("Error sending to ESP32:", error);
      alert("Failed to send settings to ESP32");
    } finally {
      setIsSending(false);
    }
  };

  return (
    
    <div className={`min-h-screen ${darkMode ? "bg-[#1A1A1A]" : "bg-[#FAFAFA]"}`}>
      <Header title="Manual Control & Settings" showBackButton={true} />

      {showSuccess && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-[#66BB6A] text-white px-6 py-4 rounded-lg shadow-lg animate-fade-in">
            Settings saved successfully
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Sensor Calibration */}
        <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
          <CardHeader>
            <CardTitle className={`${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} flex items-center gap-2`}>
              <SettingsIcon className="w-5 h-5" />
              Sensor Calibration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
              Calibrate sensors to ensure accurate readings. This process takes approximately 5 minutes.
            </p>

            <div className="space-y-2">
              <div className={`flex justify-between items-center p-3 ${darkMode ? "bg-[#3A3A3A]" : "bg-[#F1F8E9]"} rounded-lg`}>
                <span className={`text-sm ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}`}>Leaf Temperature Sensor</span>
                <Badge className="bg-[#66BB6A]">Calibrated</Badge>
              </div>
              <div className={`flex justify-between items-center p-3 ${darkMode ? "bg-[#3A3A3A]" : "bg-[#F1F8E9]"} rounded-lg`}>
                <span className={`text-sm ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}`}>Air Temperature Sensor</span>
                <Badge className="bg-[#66BB6A]">Calibrated</Badge>
              </div>
              <div className={`flex justify-between items-center p-3 ${darkMode ? "bg-[#3A3A3A]" : "bg-[#F1F8E9]"} rounded-lg`}>
                <span className={`text-sm ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}`}>Soil Moisture Sensor</span>
                <Badge className="bg-[#66BB6A]">Calibrated</Badge>
              </div>
            </div>

            <Button
              onClick={handleCalibration}
              variant="outline"
              className={`w-full ${darkMode ? "border-[#66BB6A] text-[#66BB6A] hover:bg-[#3A3A3A]" : "border-[#66BB6A] text-[#66BB6A] hover:bg-[#E8F5E9]"}`}
            >
              Recalibrate All Sensors
            </Button>

            <p className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
              Last calibration: January 28, 2026
            </p>
          </CardContent>
        </Card>

        {/* Threshold Settings */}
        <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
          <CardHeader>
            <CardTitle className={darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}> Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Acres Input */}
            <div className="space-y-2">
              <Label className={darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}>Acres</Label>
              <input
                type="number"
                placeholder="Enter acres"
                value={acres}
                onChange={(e) => setAcres(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${darkMode
                    ? "bg-[#3A3A3A] border-[#4A4A4A] text-white"
                    : "bg-white border-[#E0E0E0] text-black"
                  } focus:outline-none focus:ring-2 focus:ring-[#66BB6A]`}
              />
            </div>

            {/* Tank Height Input */}
            <div className="space-y-2">
              <Label className={darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}>Tank Height (m)</Label>
              <input
                type="number"
                placeholder="Enter tank height"
                value={tankHeight}
                onChange={(e) => setTankHeight(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${darkMode
                    ? "bg-[#3A3A3A] border-[#4A4A4A] text-white"
                    : "bg-white border-[#E0E0E0] text-black"
                  } focus:outline-none focus:ring-2 focus:ring-[#66BB6A]`}
              />
            </div>

            {/* Plant Type Input */}
            <div className="space-y-2">
              <Label className={darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}>Type of Plant</Label>
              <input
                type="text"
                placeholder="e.g., Tomato, Lettuce, Corn"
                value={plantType}
                onChange={(e) => setPlantType(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${darkMode
                    ? "bg-[#3A3A3A] border-[#4A4A4A] text-white"
                    : "bg-white border-[#E0E0E0] text-black"
                  } focus:outline-none focus:ring-2 focus:ring-[#66BB6A]`}
              />
            </div>

            <div className="space-y-2">
              <Label className={darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}>PSI Irrigation Threshold</Label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  defaultValue="0.7"
                  className="flex-1"
                />
                <span className={`${darkMode ? "text-[#66BB6A]" : "text-[#66BB6A]"} font-semibold min-w-12`}>0.70</span>
              </div>
              <p className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
                Irrigation will trigger when PSI exceeds this value
              </p>
            </div>

            <div className="space-y-2">
              <Label className={darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}> Irrigation Duration (minutes)</Label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  defaultValue="15"
                  className="flex-1"
                />
                <span className={`${darkMode ? "text-[#66BB6A]" : "text-[#66BB6A]"} font-semibold min-w-12`}>15</span>
              </div>
            </div>

            <Button
              onClick={handleSaveSettings}
              disabled={isSending}
              className="w-full bg-[#66BB6A] hover:bg-[#558B2F] text-white disabled:opacity-50"
            >
              {isSending ? "Sending to ESP32..." : "Save Settings"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
