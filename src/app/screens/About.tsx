import { Header } from "@/app/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Lightbulb } from "lucide-react";
import { useTheme } from "@/app/contexts/ThemeContext";

export function About() {
  const { darkMode } = useTheme();
  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#1A1A1A]" : "bg-[#FAFAFA]"}`}>
      <Header title="About STOMA" showBackButton={true} />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Hero Section */}
        <Card className={`${darkMode ? "bg-gradient-to-br from-[#3A3A3A] to-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9] bg-gradient-to-br from-[#E8F5E9] to-white"} shadow-md`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#66BB6A] rounded-full">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} mb-2`}>Why did STOMA decide this?</h2>
                <p className={darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}>
                  Understanding how STOMA makes intelligent irrigation decisions based on scientifically-validated 
                  plant stress indicators, sensor data, and environmental conditions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Explanation Cards */}
        <Card className={`${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "border-[#E8F5E9]"} shadow-md`}>
          <CardHeader>
            <CardTitle className={darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}>How STOMA Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Temperature Differential Analysis */}
            <div className={`p-4 ${darkMode ? "bg-[#3A3A3A]" : "bg-[#F1F8E9]"} rounded-lg border ${darkMode ? "border-[#4A4A4A]" : "border-[#C5E1A5]"}`}>
              <h3 className={`font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} mb-2`}>🌡️ Temperature Differential (ΔT)</h3>
              <p className={darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}>
                STOMA monitors the temperature difference between the leaf and the surrounding air. When plants have adequate 
                water, they cool themselves through transpiration, keeping leaf temperature close to air temperature. Under water 
                stress, stomata close to conserve water, reducing transpiration and causing leaf temperature to rise.
              </p>
              <div className={`mt-3 p-3 ${darkMode ? "bg-[#2A2A2A]" : "bg-white"} rounded border ${darkMode ? "border-[#4A4A4A]" : "border-[#C5E1A5]"}`}>
                <p className={`font-mono text-sm ${darkMode ? "text-[#66BB6A]" : "text-[#558B2F]"}`}>
                  ΔT = Leaf Temperature - Air Temperature
                </p>
                <ul className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} mt-2 space-y-1`}>
                  <li>• Well-watered crop: ΔT ≈ 0°C</li>
                  <li>• Moderate stress: ΔT = 3-5°C</li>
                  <li>• Severe stress: ΔT = 8-10°C (varies by crop)</li>
                </ul>
              </div>
            </div>

            {/* Scientific PSI Calculation */}
            <div className={`p-4 ${darkMode ? "bg-[#3A3A3A]" : "bg-[#F1F8E9]"} rounded-lg border ${darkMode ? "border-[#4A4A4A]" : "border-[#C5E1A5]"}`}>
              <h3 className={`font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} mb-2`}>📊 Scientific PSI Calculation</h3>
              <p className={darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} className="mb-3">
                STOMA uses a scientifically-validated composite Plant Stress Index (PSI) that combines three critical stress factors:
              </p>
              
              {/* Temperature Stress Component */}
              <div className={`mb-3 p-3 ${darkMode ? "bg-[#2A2A2A]" : "bg-white"} rounded border ${darkMode ? "border-[#4A4A4A]" : "border-[#C5E1A5]"}`}>
                <h4 className={`text-sm font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} mb-2`}>1. Temperature Stress (PSI<sub>temp</sub>)</h4>
                <p className={`font-mono text-sm ${darkMode ? "text-[#66BB6A]" : "text-[#558B2F]"} mb-2`}>
                  PSI<sub>temp</sub> = ΔT / ΔT<sub>max</sub>
                </p>
                <p className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
                  where ΔT<sub>max</sub> is crop-specific (e.g., Rice: 6°C, Wheat: 8°C, Cotton: 10°C)
                </p>
              </div>

              {/* Air Humidity Stress Component */}
              <div className={`mb-3 p-3 ${darkMode ? "bg-[#2A2A2A]" : "bg-white"} rounded border ${darkMode ? "border-[#4A4A4A]" : "border-[#C5E1A5]"}`}>
                <h4 className={`text-sm font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} mb-2`}>2. Air Humidity Stress (PSI<sub>RH</sub>)</h4>
                <p className={`font-mono text-sm ${darkMode ? "text-[#66BB6A]" : "text-[#558B2F]"} mb-2`}>
                  PSI<sub>RH</sub> = |Current RH - Optimal RH| / Optimal RH
                </p>
                <p className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
                  Low humidity increases transpiration demand, while high humidity can promote disease
                </p>
              </div>

              {/* Soil Moisture Stress Component */}
              <div className={`mb-3 p-3 ${darkMode ? "bg-[#2A2A2A]" : "bg-white"} rounded border ${darkMode ? "border-[#4A4A4A]" : "border-[#C5E1A5]"}`}>
                <h4 className={`text-sm font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} mb-2`}>3. Soil Moisture Stress (PSI<sub>soil</sub>)</h4>
                <p className={`font-mono text-sm ${darkMode ? "text-[#66BB6A]" : "text-[#558B2F]"} mb-2`}>
                  PSI<sub>soil</sub> = (Optimal SM - Current SM) / Optimal SM
                </p>
                <p className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
                  Direct measure of water availability at the root zone
                </p>
              </div>

              {/* Composite PSI */}
              <div className={`p-3 ${darkMode ? "bg-gradient-to-r from-[#2A2A2A] to-[#3A3A3A]" : "bg-gradient-to-r from-[#E8F5E9] to-[#F1F8E9]"} rounded border-2 ${darkMode ? "border-[#66BB6A]" : "border-[#66BB6A]"}`}>
                <h4 className={`text-sm font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} mb-2`}>Composite PSI Formula</h4>
                <p className={`font-mono text-base ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} font-bold mb-2`}>
                  PSI = (w₁ × PSI<sub>temp</sub>) + (w₂ × PSI<sub>RH</sub>) + (w₃ × PSI<sub>soil</sub>)
                </p>
                <p className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
                  Where w₁ + w₂ + w₃ = 1.0 (weights vary by crop type)
                </p>
              </div>
            </div>

            {/* Crop-Specific Weights */}
            <div className={`p-4 ${darkMode ? "bg-[#3A3A3A]" : "bg-[#F1F8E9]"} rounded-lg border ${darkMode ? "border-[#4A4A4A]" : "border-[#C5E1A5]"}`}>
              <h3 className={`font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} mb-2`}>🌾 Crop-Specific Calibration</h3>
              <p className={darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} className="mb-3">
                Different crops have different water stress responses. STOMA adjusts weights accordingly:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className={`p-3 ${darkMode ? "bg-[#2A2A2A]" : "bg-white"} rounded border ${darkMode ? "border-[#4A4A4A]" : "border-[#C5E1A5]"}`}>
                  <h4 className={`text-sm font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} mb-2`}>Leafy Crops (Tomato, Potato)</h4>
                  <ul className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} space-y-1`}>
                    <li>• w₁ (Temp): 0.45 - High sensitivity to leaf temp</li>
                    <li>• w₂ (Air RH): 0.30 - Moderate humidity impact</li>
                    <li>• w₃ (Soil): 0.25 - Shallow roots, quick response</li>
                  </ul>
                </div>
                <div className={`p-3 ${darkMode ? "bg-[#2A2A2A]" : "bg-white"} rounded border ${darkMode ? "border-[#4A4A4A]" : "border-[#C5E1A5]"}`}>
                  <h4 className={`text-sm font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} mb-2`}>Deep-Root Crops (Cotton, Soybean)</h4>
                  <ul className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} space-y-1`}>
                    <li>• w₁ (Temp): 0.35 - Moderate leaf response</li>
                    <li>• w₂ (Air RH): 0.30 - Moderate humidity impact</li>
                    <li>• w₃ (Soil): 0.35 - Deep roots, soil is critical</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Decision Thresholds */}
            <div className={`p-4 ${darkMode ? "bg-[#3A3A3A]" : "bg-[#F1F8E9]"} rounded-lg border ${darkMode ? "border-[#4A4A4A]" : "border-[#C5E1A5]"}`}>
              <h3 className={`font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} mb-2`}>🎯 Intelligent Decision Thresholds</h3>
              <p className={darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} className="mb-3">
                STOMA uses normalized PSI values (0-1) to make consistent decisions:
              </p>
              <div className="space-y-2">
                <div className={`p-3 ${darkMode ? "bg-[#2A2A2A]" : "bg-white"} rounded border-l-4 border-[#66BB6A]`}>
                  <p className={`font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"}`}>PSI {"<"} 0.25 → NORMAL</p>
                  <p className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>Plant is healthy, no intervention needed</p>
                </div>
                <div className={`p-3 ${darkMode ? "bg-[#2A2A2A]" : "bg-white"} rounded border-l-4 border-[#FFA726]`}>
                  <p className={`font-semibold ${darkMode ? "text-[#FFA726]" : "text-[#F57C00]"}`}>0.25 ≤ PSI {"<"} 0.45 → STRESS RISING</p>
                  <p className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>Early warning, monitoring intensified</p>
                </div>
                <div className={`p-3 ${darkMode ? "bg-[#2A2A2A]" : "bg-white"} rounded border-l-4 border-[#FF9800]`}>
                  <p className={`font-semibold ${darkMode ? "text-[#FF9800]" : "text-[#EF6C00]"}`}>0.45 ≤ PSI {"<"} 0.60 → STRESSED</p>
                  <p className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>Plant experiencing significant stress</p>
                </div>
                <div className={`p-3 ${darkMode ? "bg-[#2A2A2A]" : "bg-white"} rounded border-l-4 border-[#EF5350]`}>
                  <p className={`font-semibold ${darkMode ? "text-[#EF5350]" : "text-[#C62828]"}`}>PSI ≥ 0.60 → CRITICAL (Irrigation Triggered)</p>
                  <p className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>Automatic irrigation starts to prevent damage</p>
                </div>
                <div className={`p-3 ${darkMode ? "bg-[#2A2A2A]" : "bg-white"} rounded border-l-4 border-[#42A5F5]`}>
                  <p className={`font-semibold ${darkMode ? "text-[#42A5F5]" : "text-[#1976D2]"}`}>Post-Irrigation: PSI {"<"} 0.35 → RECOVERED</p>
                  <p className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>Plant successfully recovered from stress</p>
                </div>
              </div>
            </div>

            {/* Real Example */}
            <div className={`p-4 ${darkMode ? "bg-[#3A3A3A]" : "bg-[#F1F8E9]"} rounded-lg border ${darkMode ? "border-[#4A4A4A]" : "border-[#C5E1A5]"}`}>
              <h3 className={`font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} mb-2`}>💡 Real-World Example</h3>
              <p className={`${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} mb-3`}>
                <strong>Scenario:</strong> Tomato crop (leafy) on a hot afternoon
              </p>
              <div className={`p-3 ${darkMode ? "bg-[#2A2A2A]" : "bg-white"} rounded mb-3`}>
                <p className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}`}>
                  <strong>Sensor Readings:</strong>
                </p>
                <ul className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} mt-1 space-y-1`}>
                  <li>• Leaf Temperature: 28.5°C</li>
                  <li>• Air Temperature: 24.0°C</li>
                  <li>• Air Humidity: 45% (Optimal: 65%)</li>
                  <li>• Soil Moisture: 40% (Optimal: 55%)</li>
                  <li>• ΔT<sub>max</sub> for tomato: 8.0°C</li>
                </ul>
              </div>
              <div className={`p-3 ${darkMode ? "bg-[#2A2A2A]" : "bg-white"} rounded mb-3`}>
                <p className={`text-sm ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} mb-2`}>
                  <strong>Step-by-step Calculation:</strong>
                </p>
                <div className={`text-xs ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} space-y-2 font-mono`}>
                  <div>
                    <p className="text-[#66BB6A]">1. PSI<sub>temp</sub> = (28.5 - 24.0) / 8.0 = 0.56</p>
                  </div>
                  <div>
                    <p className="text-[#66BB6A]">2. PSI<sub>RH</sub> = |45 - 65| / 65 = 0.31</p>
                  </div>
                  <div>
                    <p className="text-[#66BB6A]">3. PSI<sub>soil</sub> = (55 - 40) / 55 = 0.27</p>
                  </div>
                  <div className="pt-2 border-t border-[#66BB6A]">
                    <p className="text-[#66BB6A] font-bold">PSI = (0.45 × 0.56) + (0.30 × 0.31) + (0.25 × 0.27)</p>
                    <p className="text-[#66BB6A] font-bold">PSI = 0.252 + 0.093 + 0.068 = 0.413</p>
                  </div>
                </div>
              </div>
              <div className={`p-3 ${darkMode ? "bg-gradient-to-r from-[#FFA726] to-[#FF9800]" : "bg-gradient-to-r from-[#FFF3E0] to-[#FFE0B2]"} rounded`}>
                <p className={`font-semibold ${darkMode ? "text-white" : "text-[#E65100]"}`}>
                  Result: PSI = 0.413 → STRESS RISING
                </p>
                <p className={`text-xs ${darkMode ? "text-white" : "text-[#EF6C00]"} mt-1`}>
                  STOMA increases monitoring frequency and prepares irrigation system, but doesn't irrigate yet
                </p>
              </div>
            </div>

            {/* Sensor Reliability */}
            <div className={`p-4 ${darkMode ? "bg-[#3A3A3A]" : "bg-[#F1F8E9]"} rounded-lg border ${darkMode ? "border-[#4A4A4A]" : "border-[#C5E1A5]"}`}>
              <h3 className={`font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} mb-2`}>🔍 Sensor Reliability & Trust Levels</h3>
              <p className={darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}>
                STOMA continuously monitors sensor health by tracking the last 10 readings and checking for:
              </p>
              <ul className={`list-disc list-inside ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} mt-2 space-y-1 ml-4`}>
                <li>Reading consistency and stability (standard deviation)</li>
                <li>Values within expected physical ranges</li>
                <li>Detection of stuck or unresponsive sensors</li>
                <li>Sudden anomalous spikes or drops</li>
              </ul>
              <p className={`${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} mt-2`}>
                When all sensors show trust levels above 85%, STOMA makes confident irrigation decisions. 
                If trust drops, the system switches to conservative offline mode.
              </p>
            </div>

            {/* Offline Resilience */}
            <div className={`p-4 ${darkMode ? "bg-[#3A3A3A]" : "bg-[#F1F8E9]"} rounded-lg border ${darkMode ? "border-[#4A4A4A]" : "border-[#C5E1A5]"}`}>
              <h3 className={`font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} mb-2`}>📡 Offline Decision Logic</h3>
              <p className={darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}>
                When connectivity is lost or sensor data becomes unreliable, STOMA doesn't stop working. 
                It switches to offline decision mode using:
              </p>
              <ul className={`list-disc list-inside ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} mt-2 space-y-1 ml-4`}>
                <li>Historical irrigation patterns from the past 7 days</li>
                <li>Time-of-day stress predictions based on past data</li>
                <li>Last known reliable sensor readings with confidence intervals</li>
                <li>Conservative safety thresholds to prevent over-irrigation</li>
              </ul>
              <p className={`${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} mt-2`}>
                Use the <span className="font-semibold text-[#66BB6A]">"Sync Now"</span> button 
                to synchronize offline decisions with the cloud when connectivity returns.
              </p>
            </div>

            {/* Learning System */}
            <div className={`p-4 ${darkMode ? "bg-[#3A3A3A]" : "bg-[#F1F8E9]"} rounded-lg border ${darkMode ? "border-[#4A4A4A]" : "border-[#C5E1A5]"}`}>
              <h3 className={`font-semibold ${darkMode ? "text-[#66BB6A]" : "text-[#2E7D32]"} mb-2`}>🌱 Adaptive Learning</h3>
              <p className={darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"}>
                STOMA continuously learns from your plant's unique stress patterns:
              </p>
              <ul className={`list-disc list-inside ${darkMode ? "text-[#A0A0A0]" : "text-[#689F38]"} mt-2 space-y-1 ml-4`}>
                <li>Identifies daily stress patterns (peak stress typically 11 AM - 3 PM)</li>
                <li>Optimizes irrigation timing to prevent stress before it becomes critical</li>
                <li>Adapts to seasonal changes and weather patterns</li>
                <li>Reduces water waste through precise, data-driven irrigation</li>
              </ul>
            </div>

            {/* The Result */}
            <div className={`p-4 ${darkMode ? "bg-gradient-to-r from-[#66BB6A] to-[#558B2F]" : "bg-gradient-to-r from-[#66BB6A] to-[#558B2F]"} rounded-lg text-white`}>
              <h3 className="font-semibold mb-2">✨ The Result: Precision Agriculture</h3>
              <p>
                By combining scientifically-validated stress indicators, intelligent thresholds, sensor reliability monitoring, 
                offline resilience, and adaptive learning, STOMA ensures your plants receive exactly the water they need, 
                precisely when they need it. This approach saves water, reduces plant stress, promotes optimal growth, 
                and maximizes crop yield—all while being defensible with peer-reviewed plant physiology research.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
