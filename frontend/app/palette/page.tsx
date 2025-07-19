import React from "react";

// Color swatch component
const ColorSwatch = ({ name, variable, hexValue }: { name: string; variable: string; hexValue?: string }) => {
    return (
        <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <div className={`h-24 flex items-end p-2`} style={{ backgroundColor: `hsl(var(${variable}))` }}>
                <span className="text-white text-sm font-mono drop-shadow-md">{variable}</span>
            </div>
            <div className="p-3 bg-white">
                <p className="text-sm font-medium">{name}</p>
                {hexValue && <p className="text-xs text-gray-500 font-mono">{hexValue}</p>}
            </div>
        </div>
    );
};

// Color family section component
const ColorFamily = ({ title, colors }: { title: string; colors: { name: string; variable: string; hexValue?: string }[] }) => {
    return (
        <div className="mb-8">
            <h3 className="text-xl font-medium mb-3">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {colors.map((color) => (
                    <ColorSwatch key={color.variable} name={color.name} variable={color.variable} hexValue={color.hexValue} />
                ))}
            </div>
        </div>
    );
};

export default function PalettePage() {
    // UI Colors
    const uiNavyColors = [
        { name: "Navy 950", variable: "--ui-navy-950", hexValue: "#012A4A" },
        { name: "Navy 900", variable: "--ui-navy-900", hexValue: "#012494" },
        { name: "Navy 800", variable: "--ui-navy-800", hexValue: undefined },
        { name: "Navy 700", variable: "--ui-navy-700", hexValue: "#01497C" },
        { name: "Navy 600", variable: "--ui-navy-600", hexValue: undefined },
        { name: "Navy 500", variable: "--ui-navy-500", hexValue: "#2A6F97" },
        { name: "Navy 400", variable: "--ui-navy-400", hexValue: "#61A5C2" },
        { name: "Navy 300", variable: "--ui-navy-300", hexValue: "#49D6E5" },
        { name: "Navy 200", variable: "--ui-navy-200", hexValue: "#A9D6E5" },
        { name: "Navy 100", variable: "--ui-navy-100", hexValue: undefined },
    ];

    const uiPurpleColors = [
        { name: "Purple 600", variable: "--ui-purple-600", hexValue: "#6145C2" },
        { name: "Purple 500", variable: "--ui-purple-500", hexValue: undefined },
        { name: "Purple 400", variable: "--ui-purple-400", hexValue: undefined },
    ];

    const uiTerracottaColors = [
        { name: "Terracotta 700", variable: "--ui-terracotta-700", hexValue: undefined },
        { name: "Terracotta 600", variable: "--ui-terracotta-600", hexValue: undefined },
        { name: "Terracotta 500", variable: "--ui-terracotta-500", hexValue: "#BE5A38" },
        { name: "Terracotta 400", variable: "--ui-terracotta-400", hexValue: undefined },
        { name: "Terracotta 300", variable: "--ui-terracotta-300", hexValue: undefined },
    ];

    const uiBeigeColors = [
        { name: "Beige 300", variable: "--ui-beige-300", hexValue: undefined },
        { name: "Beige 200", variable: "--ui-beige-200", hexValue: "#EAE0CC" },
        { name: "Beige 100", variable: "--ui-beige-100", hexValue: "#F8F2DC" },
    ];

    // Block Colors
    const blockPinkColors = [
        { name: "Pink 600", variable: "--block-pink-600", hexValue: undefined },
        { name: "Pink 500", variable: "--block-pink-500", hexValue: "#F72585" },
        { name: "Pink 400", variable: "--block-pink-400", hexValue: undefined },
    ];

    const blockMagentaColors = [
        { name: "Magenta 700", variable: "--block-magenta-700", hexValue: undefined },
        { name: "Magenta 600", variable: "--block-magenta-600", hexValue: "#B5179E" },
        { name: "Magenta 500", variable: "--block-magenta-500", hexValue: undefined },
    ];

    const blockPurpleColors = [
        { name: "Purple 800", variable: "--block-purple-800", hexValue: undefined },
        { name: "Purple 700", variable: "--block-purple-700", hexValue: "#7209B7" },
        { name: "Purple 600", variable: "--block-purple-600", hexValue: undefined },
        { name: "Purple 500", variable: "--block-purple-500", hexValue: undefined },
    ];

    const blockIndigoColors = [
        { name: "Indigo 800", variable: "--block-indigo-800", hexValue: "#3A0CA3" },
        { name: "Indigo 700", variable: "--block-indigo-700", hexValue: "#560BAD" },
        { name: "Indigo 600", variable: "--block-indigo-600", hexValue: "#480CA8" },
        { name: "Indigo 500", variable: "--block-indigo-500", hexValue: undefined },
    ];

    const blockBlueColors = [
        { name: "Blue 700", variable: "--block-blue-700", hexValue: undefined },
        { name: "Blue 600", variable: "--block-blue-600", hexValue: "#3F37C9" },
        { name: "Blue 500", variable: "--block-blue-500", hexValue: "#4361EE" },
        { name: "Blue 400", variable: "--block-blue-400", hexValue: "#4895EF" },
    ];

    const blockCyanColors = [
        { name: "Cyan 500", variable: "--block-cyan-500", hexValue: undefined },
        { name: "Cyan 400", variable: "--block-cyan-400", hexValue: "#4CC9F0" },
        { name: "Cyan 300", variable: "--block-cyan-300", hexValue: undefined },
    ];

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold mb-6">SQL Query Builder Color Palette</h1>
            <p className="text-lg mb-8">This page displays all available colors in the application&apos;s design system, organized by usage context.</p>

            <div className="mb-12">
                <h2 className="text-3xl font-semibold mb-6 pb-2 border-b">UI Colors (Muted/Subdued)</h2>
                <p className="mb-6">These colors are used for the application interface elements such as navigation, cards, backgrounds, and form elements.</p>
                <ColorFamily title="Navy/Blue Family" colors={uiNavyColors} />
                <ColorFamily title="Purple Family" colors={uiPurpleColors} />
                <ColorFamily title="Earth Tones" colors={uiTerracottaColors} />
                <ColorFamily title="Neutral Tones" colors={uiBeigeColors} />
            </div>

            <div className="mb-12">
                <h2 className="text-3xl font-semibold mb-6 pb-2 border-b">Block Colors (Vibrant)</h2>
                <p className="mb-6">
                    These vibrant colors are used for the query-building blocks and interactive elements to create visual distinction and hierarchy.
                </p>
                <ColorFamily title="Pink/Magenta Family" colors={[...blockPinkColors, ...blockMagentaColors]} />
                <ColorFamily title="Purple Family" colors={blockPurpleColors} />
                <ColorFamily title="Indigo Family" colors={blockIndigoColors} />
                <ColorFamily title="Blue Family" colors={blockBlueColors} />
                <ColorFamily title="Cyan Family" colors={blockCyanColors} />
            </div>

            <div className="mb-12">
                <h2 className="text-3xl font-semibold mb-6 pb-2 border-b">Usage Examples</h2>

                <div className="mb-8">
                    <h3 className="text-xl font-medium mb-3">UI Elements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 rounded-lg bg-ui-navy-950 text-white">
                            <h4 className="font-medium">Dark Background (--ui-navy-950)</h4>
                            <p className="mt-2">Primary container background</p>
                        </div>
                        <div className="p-4 rounded-lg bg-ui-beige-100 border border-ui-navy-300">
                            <h4 className="font-medium text-ui-navy-900">Light Background (--ui-beige-100)</h4>
                            <p className="mt-2 text-ui-navy-700">Content area with navy text</p>
                        </div>
                        <div className="p-4 rounded-lg bg-white border border-ui-navy-200">
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-ui-navy-700 text-white rounded-md">Primary Button</button>
                                <button className="px-4 py-2 bg-ui-terracotta-500 text-white rounded-md">Secondary Button</button>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-white border border-ui-navy-200">
                            <div className="flex flex-col gap-2">
                                <div className="p-2 bg-ui-navy-200 text-ui-navy-900 rounded">Navigation item</div>
                                <div className="p-2 bg-ui-navy-300 text-ui-navy-900 rounded">Selected navigation item</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-medium mb-3">Query Blocks</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 rounded-lg bg-white border border-ui-navy-200">
                            <div className="flex flex-col gap-2">
                                <div className="p-3 bg-block-pink-500 text-white rounded">SELECT Statement</div>
                                <div className="p-3 bg-block-magenta-600 text-white rounded">FROM Clause</div>
                                <div className="p-3 bg-block-indigo-700 text-white rounded">WHERE Condition</div>
                                <div className="p-3 bg-block-blue-500 text-white rounded">JOIN Operation</div>
                                <div className="p-3 bg-block-cyan-400 text-white rounded">GROUP BY Clause</div>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-ui-navy-900 text-white">
                            <h4 className="font-medium mb-2">Query Building Workspace</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="px-2 py-1 bg-block-pink-500 rounded text-xs">Column</span>
                                <span className="px-2 py-1 bg-block-purple-700 rounded text-xs">Function</span>
                                <span className="px-2 py-1 bg-block-indigo-600 rounded text-xs">Table</span>
                                <span className="px-2 py-1 bg-block-blue-400 rounded text-xs">Operator</span>
                                <span className="px-2 py-1 bg-block-cyan-400 rounded text-xs">Value</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
