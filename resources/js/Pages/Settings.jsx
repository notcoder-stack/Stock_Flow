import Header from "../components/Header";
import { useMantineColorScheme, useComputedColorScheme } from "@mantine/core";
import { useState } from "react";

const mockSettings = [
    { label: "Current password", type: "text" },
    { label: "New password", type: "text" },
    { label: "Confirm password", type: "text" },
];

export default function Settings() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme("light");
    const [userSettings, setUserSettings] = useState(mockSettings);
    const isDark = computedColorScheme === "dark";

    const handleToggleChange = () => {
        setColorScheme(isDark ? "light" : "dark");
    };

    return (
        <div className="w-full">
            <Header name="User Settings" />
            <div className="overflow-x-auto mt-5 shadow-md">
                <table className="min-w-full rounded-lg">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                                Settings
                            </th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                                Value
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {userSettings.map((setting, index) => (
                            <tr key={setting.label}>
                                <td className="py-2 px-4">{setting.label}</td>
                                <td className="py-2 px-4">
                                    <input
                                        type="text"
                                        className="px-4 py-2 border rounded-lg text-gray-500 focus-outline-none focus:border-blue-500"
                                        value={setting.value || ""}
                                        onChange={(e) => {
                                            const settingsCopy = [
                                                ...userSettings,
                                            ];
                                            settingsCopy[index].value =
                                                e.target.value;
                                            setUserSettings(settingsCopy);
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td className="py-2 px-4">Dark Mode</td>
                            <td className="py-2 px-4">
                                <label className="inline-flex relative items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={isDark}
                                        onChange={handleToggleChange}
                                    />
                                    <div
                                        className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-blue-400 peer-focus:ring-4
                                        transition peer-checked:after:translate-x-full peer-checked:after:border-white
                                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                                        after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                        peer-checked:bg-blue-600"
                                    ></div>
                                </label>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
