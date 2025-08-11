import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, RefreshCw, Plus, Minus, Upload } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

// Helper to format numbers to 2dp consistently
const fmt = (n: number): string => (Number.isFinite(n) ? n.toFixed(2) : "-");

// Random 5 values in [-5, 5], formatted like "+2.5, -1.2, 0, +4.03, -3"
export function genRandomBatch(min = -5, max = 5, count = 5, dp = 2): string {
  const factor = Math.pow(10, dp);

  const vals = Array.from({ length: count }, () => {
    // random in [min, max]
    let v = min + Math.random() * (max - min);

    // round to dp and avoid -0
    v = Math.round(v * factor) / factor;
    if (Object.is(v, -0)) v = 0;

    // pretty print
    const s = v.toFixed(dp).replace(/\.?0+$/, ""); // trim trailing zeros/decimal
    const sign = v > 0 ? "+" : "";
    return `${sign}${s}`;
  });

  return vals.join(", ");
}

export default function TSLA_TSLL_Price_Simulator() {
  // Initial inputs
  const [tslaInit, setTslaInit] = useState(100);
  const [tsllInit, setTsllInit] = useState(50);
  const [tsllCount, setTsllCount] = useState(10);

  const [tslaInitInput, setTslaInitInput] = useState<string>("100");
  const [tsllInitInput, setTsllInitInput] = useState<string>("50");
  const [tsllCountInput, setTsllCountInput] = useState<string>("10");

  // Current prices
  const [tsla, setTsla] = useState(tslaInit);
  const [tsll, setTsll] = useState(tsllInit);

  // Change input (percent)
  const [pctInput, setPctInput] = useState<string>("0");
  const [batch, setBatch] = useState(""); // e.g. "+5,-3,+2.5"

  // History of steps
  type Row = {
    step: number;
    pct: number;
    tsla: number;
    tsll: number;
    profit: number;
  };

  const [rows, setRows] = useState<Row[]>([]);

  const profit = useMemo(
    () => (tsll - tsllInit) * (tsllCount || 0),
    [tsll, tsllInit, tsllCount]
  );

  const tslaInitNum = Number(tslaInitInput);
  const tsllInitNum = Number(tsllInitInput);
  const tsllCountNum = Number(tsllCountInput);
  const disabled =
    !Number.isFinite(tslaInitNum) || tslaInitNum === 0 ||
    !Number.isFinite(tsllInitNum) || tsllInitNum === 0 ||
    !Number.isFinite(tsllCountNum) || tsllCountNum === 0;

  const setAsInitials = () => {
    setTsla(tslaInit);
    setTsll(tsllInit);
    setRows([]);
    setPctInput("0");
  };

  const applyChange = (deltaPct: number) => {
    if (!Number.isFinite(deltaPct)) return;
    const tslaMult = 1 + deltaPct / 100;
    const tsllMult = 1 + (2 * deltaPct) / 100; // 2x leverage
    const nextTsla = tsla * tslaMult;
    const nextTsll = tsll * tsllMult;
    const nextProfit = (nextTsll - tsllInit) * tsllCount;
    const step = rows.length + 1;
    setTsla(nextTsla);
    setTsll(nextTsll);
    setRows([
      ...rows,
      {
        step,
        pct: deltaPct,
        tsla: nextTsla,
        tsll: nextTsll,
        profit: nextProfit,
      },
    ]);
  };

  const applyBatch = () => {
    if (!batch?.trim()) return;
    // Accept formats: "+5,-3,2.5,-1" or with spaces/newlines
    const tokens = batch
      .split(/[\n,\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    let curTsla = tsla;
    let curTsll = tsll;
    const newRows = [...rows];
    tokens.forEach((tok) => {
      // token may be like +5 or -3 or 2 or -2.5
      const v = Number(tok);
      if (!Number.isFinite(v)) return;
      const tslaMult = 1 + v / 100;
      const tsllMult = 1 + (2 * v) / 100;
      curTsla *= tslaMult;
      curTsll *= tsllMult;
      const step = newRows.length + 1;
      newRows.push({
        step,
        pct: v,
        tsla: curTsla,
        tsll: curTsll,
        profit: (curTsll - tsllInit) * tsllCount,
      });
    });
    setTsla(curTsla);
    setTsll(curTsll);
    setRows(newRows);
  };

  const generateRandom = () => {
    setBatch(genRandomBatch());
  };

  const undoLast = () => {
    if (rows.length === 0) return;
    const newRows = rows.slice(0, -1);
    if (newRows.length === 0) {
      setTsla(tslaInit);
      setTsll(tsllInit);
    } else {
      const last = newRows[newRows.length - 1];
      setTsla(last.tsla);
      setTsll(last.tsll);
    }
    setRows(newRows);
  };

  const clearHistory = () => {
    setRows([]);
    setTsla(tslaInit);
    setTsll(tsllInit);
    setPctInput("0");
  };

  const chartData = useMemo(() => {
    const base = [
      { step: 0, label: "Start", tsla: tslaInit, tsll: tsllInit, profit: 0 },
      ...rows.map((r) => ({
        step: r.step,
        label: `#${r.step} (${fmt(r.pct)}%)`,
        tsla: r.tsla,
        tsll: r.tsll,
        profit: r.profit,
        pct: r.pct
      })),
    ];
    return base;
  }, [rows, tslaInit, tsllInit]);

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">TSLA–TSLL Price Simulator</h1>
        <div className="text-sm text-muted-foreground">2× leverage assumption on TSLL</div>
      </div>

      {/* Inputs */}
      <Card className="shadow-sm">
        <CardContent className="p-6 grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="tslaInit">Initial TSLA</Label>
            <Input
              id="tslaInit"
              type="number"
              step="0.01"
              value={tslaInitInput}
              onChange={(e) => setTslaInitInput(e.target.value)}
              onBlur={() => {
                const n = Number(tslaInitInput);
                if (Number.isFinite(n)) {
                  setTslaInit(n);                     // update the numeric canonical value
                  setTslaInitInput(n.toFixed(2));     // tidy formatting
                } else {
                  // fallback to current numeric value if parse failed
                  setTslaInitInput(tslaInit.toFixed(2));
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tsllInit">Initial TSLL</Label>
            <Input
              id="tsllInit"
              type="number"
              step="0.01"
              value={tsllInitInput}
              onChange={(e) => setTsllInitInput(e.target.value)}
              onBlur={() => {
                const n = Number(tsllInitInput);
                if (Number.isFinite(n)) {
                  setTsllInit(n);
                  setTsllInitInput(n.toFixed(2));
                } else {
                  setTsllInitInput(tsllInit.toFixed(2));
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tsllCount"># of TSLL</Label>
            <Input
              id="tsllCount"
              type="number"
              step="0.01"                // keep if you want fractional units
              value={tsllCountInput}
              onChange={(e) => setTsllCountInput(e.target.value)}
              onBlur={() => {
                const n = Number(tsllCountInput);
                if (Number.isFinite(n)) {
                  setTsllCount(n);
                  setTsllCountInput(n.toString());
                } else {
                  setTsllCountInput(tsllCount.toFixed(2));
                }
              }}
            />
          </div>

          <div className="md:col-span-3 flex flex-wrap items-end gap-3 pt-2">
            <Button
              variant="outlineGray"
              onClick={setAsInitials}
              title="Reset current prices to the initial inputs"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Set as initial
            </Button>
            <Button
              variant="outlineRose"
              onClick={clearHistory}
              title="Clear your simulation history"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Clear history
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Current TSLA</div>
            <div className="text-3xl font-semibold">${fmt(tsla)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Current TSLL</div>
            <div className="text-3xl font-semibold">${fmt(tsll)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Unrealized P/L (TSLL)</div>
            <div className={`text-3xl font-semibold ${profit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              ${fmt(profit)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
            <div className="space-y-2">
              <Label htmlFor="pct">Change % (TSLA)</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setPctInput((p) => {
                      const n = Number(p);
                      return Number.isFinite(n) ? (n - 1).toFixed(2) : "0.00";
                    })
                  }
                  disabled={disabled}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="pct"
                  type="number"
                  step="0.01"
                  value={pctInput}                      // <-- string
                  onChange={(e) => setPctInput(e.target.value)}  // <-- do NOT Number(...) here
                  onBlur={() => {                       // optional tidy-up on blur
                    const n = Number(pctInput);
                    setPctInput(Number.isFinite(n) ? n.toFixed(2) : "0");
                  }}
                  className="text-right"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setPctInput((p) => {
                      const n = Number(p);
                      return Number.isFinite(n) ? (n + 1).toFixed(2) : "0.00";
                    })
                  }
                  disabled={disabled}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <input
                type="range"
                min={-20}
                max={20}
                step={0.1}
                value={Number(pctInput) || 0}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setPctInput(Number.isFinite(n) ? n.toFixed(2) : "0");
                }}
                className="w-full"
                disabled={disabled}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="softBlue" onClick={() => applyChange(Number(pctInput))} disabled={disabled}>
                Apply Change
              </Button>
              <Button variant="softGray" onClick={undoLast} disabled={disabled || rows.length === 0}>
                Undo
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="batch">Batch apply (comma/space/newline separated %, e.g. &quot;+5, -3, 2.5, -1&quot;)</Label>
            <div className="flex items-start gap-3">
              <Input
                id="batch"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                placeholder="+5, -3, +2.5, -1"
              />
              <Button variant="softPurple" onClick={generateRandom} disabled={disabled}>
                Generate Random
              </Button>
              <Button variant="softBlue" onClick={applyBatch} disabled={disabled || !batch.trim()}>
                <Upload className="mr-2 h-4 w-4" /> Apply Batch
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Simulation Chart</h2>
            <div className="text-sm text-muted-foreground">Start + each step</div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="step" tickFormatter={(v) => `#${v}`} />
                <YAxis />
                <Tooltip
                  formatter={(val) => `$${fmt(Number(val))}`}
                  labelFormatter={(label, payload) => {
                    const p = payload?.[0]?.payload;            // the full data point
                    const stepPct = Number(p?.pct);
                    const pctText =
                      Number.isFinite(stepPct) ? ` • Δ ${fmt(stepPct)}%` : "";
                    return `Step ${label}${pctText}`;
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="tsla" name="TSLA" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="tsll" name="TSLL" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card className="shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">History</h2>
            <div className="text-sm text-muted-foreground">Prices and P/L after each change</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 pr-4">Step</th>
                  <th className="py-2 pr-4">Change %</th>
                  <th className="py-2 pr-4">TSLA</th>
                  <th className="py-2 pr-4">TSLL</th>
                  <th className="py-2 pr-4">Profit (TSLL)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4">0</td>
                  <td className="py-2 pr-4">–</td>
                  <td className="py-2 pr-4">${fmt(tslaInit)}</td>
                  <td className="py-2 pr-4">${fmt(tsllInit)}</td>
                  <td className="py-2 pr-4">$0.00</td>
                </tr>
                {rows.map((r) => (
                  <tr key={r.step} className="border-b">
                    <td className="py-2 pr-4">{r.step}</td>
                    <td className="py-2 pr-4">{fmt(r.pct)}%</td>
                    <td className="py-2 pr-4">${fmt(r.tsla)}</td>
                    <td className="py-2 pr-4">${fmt(r.tsll)}</td>
                    <td className={`py-2 pr-4 ${r.profit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      ${fmt(r.profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Notes: This simulator assumes TSLL responds at exactly 2× the single-step % change in TSLA. Real leveraged ETFs have daily rebalancing, decay, fees, and tracking error. This tool is for simple what-if exploration only.
      </p>
    </div>
  );
}
