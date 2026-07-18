import { useEffect } from "react";
import {
  Activity,
  BarChart3,
  Beaker,
  Bell,
  BookOpen,
  Bookmark,
  Briefcase,
  ChevronDown,
  Clock,
  Cog,
  Dna,
  GitBranch,
  LayoutDashboard,
  LifeBuoy,
  Lightbulb,
  MessageSquare,
  Microscope,
  Network,
  Pill,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Waves,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Pie,
  PieChart as RechartsPieChart,
  XAxis,
  YAxis,
} from "recharts";

export default function App() {
  return (
    <div>
      <div className="min-h-[1080px] bg-zinc-950 text-neutral-50 flex w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <aside className="shrink-0 sticky bg-[#001529] border-white/10 border-t-0 border-r-1 border-b-0 border-l-0 border-solid flex top-0 flex-col w-64 h-270">
          <div className="flex p-6 items-center gap-2">
            <div className="size-9 bg-gradient-to-br from-[#00B5AD] to-[#7c3aed] shadow-lg shadow-[#00B5AD]/20 rounded-xl flex justify-center items-center">
              <Dna className="size-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="leading-none font-bold text-sm leading-5 tracking-tight">
                OncoKG
              </span>
              <span className="font-medium uppercase text-[#00B5AD] text-[10px] tracking-widest">
                Enterprise
              </span>
            </div>
          </div>
          <nav className="overflow-y-auto flex px-3 flex-col flex-1 gap-1">
            <a className="relative font-medium shadow-[0_0_20px_-4px_#00B5AD] rounded-lg bg-[#00B5AD]/10 text-neutral-50 text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
              <span className="top-1/2 -translate-y-1/2 shadow-[0_0_10px_#00B5AD] rounded-r-full bg-[#00B5AD] absolute left-0 w-1 h-6" />
              <LayoutDashboard className="size-4 text-[#00B5AD]" />
              Dashboard
            </a>
            <a className="font-medium rounded-lg text-[#9f9fa9] text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
              <Network className="size-4" />
              Knowledge Graph
            </a>
            <a className="font-medium rounded-lg text-[#9f9fa9] text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
              <Microscope className="size-4" />
              Simulation Lab
            </a>
            <a className="font-medium rounded-lg text-[#9f9fa9] text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
              <Pill className="size-4" />
              Drug Explorer
            </a>
            <a className="font-medium rounded-lg text-[#9f9fa9] text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
              <Dna className="size-4" />
              Gene Explorer
            </a>
            <a className="font-medium rounded-lg text-[#9f9fa9] text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
              <Zap className="size-4" />
              Mutation Explorer
            </a>
            <a className="font-medium rounded-lg text-[#9f9fa9] text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
              <Activity className="size-4" />
              Disease Explorer
            </a>
            <a className="font-medium rounded-lg text-[#9f9fa9] text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
              <Beaker className="size-4" />
              Clinical Trials
            </a>
            <a className="font-medium rounded-lg text-[#9f9fa9] text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
              <BookOpen className="size-4" />
              Publications
            </a>
            <a className="font-medium rounded-lg text-[#9f9fa9] text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
              <BarChart3 className="size-4" />
              Analytics
            </a>
            <a className="font-medium rounded-lg text-[#9f9fa9] text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
              <Bookmark className="size-4" />
              Saved Queries
            </a>
            <a className="font-medium rounded-lg text-[#9f9fa9] text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
              <Briefcase className="size-4" />
              Workspace
            </a>
            <a className="font-medium rounded-lg text-[#9f9fa9] text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
              <Settings className="size-4" />
              Administration
            </a>
            <div className="bg-white/10 my-2 h-px" />
            <a className="font-medium rounded-lg text-[#9f9fa9] text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
              <Cog className="size-4" />
              Settings
            </a>
            <a className="font-medium rounded-lg text-[#9f9fa9] text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
              <LifeBuoy className="size-4" />
              Help Center
            </a>
          </nav>
          <div className="rounded-xl bg-white/5 border-white/10 border-1 border-solid flex m-3 p-4 flex-col gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#00B5AD]" />
              <span className="font-semibold text-xs leading-4">
                Neo4j Cluster
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 shadow-[0_0_8px_#34d399] rounded-full bg-emerald-400" />
              <span className="text-[#9f9fa9] text-xs leading-4">
                All systems operational
              </span>
            </div>
          </div>
        </aside>
        <div className="min-w-0 flex flex-col flex-1">
          <header className="sticky z-20 backdrop-blur-xl bg-[#0B1220]/80 border-white/10 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex top-0 px-8 py-4 items-center gap-4">
            <div className="relative w-105">
              <Search className="top-1/2 -translate-y-1/2 size-4 text-[#9f9fa9] absolute left-3" />
              <Input
                placeholder="Search genes, drugs, trials..."
                className="bg-white/5 border-white/10 border-0 border-solid pl-9 pr-16 h-10"
                defaultValue=""
              />
              <kbd className="top-1/2 -translate-y-1/2 rounded-sm bg-white/5 text-[#9f9fa9] text-[10px] border-white/10 border-1 border-solid absolute right-3 px-1.5 py-0.5">
                ⌘K
              </kbd>
            </div>
            <div className="flex-1" />
            <Button className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] shadow-lg shadow-purple-500/20 text-white border-black/1 border-0 border-solid gap-2 h-10">
              <Sparkles className="size-4" />
              AI Assistant
            </Button>
            <Select defaultValue="oncology-r&d">
              <SelectTrigger className="bg-white/5 border-white/10 border-0 border-solid w-52 h-10">
                <div className="flex items-center gap-2">
                  <Briefcase className="size-4 text-[#00B5AD]" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oncology-r&d">{`Oncology R&D`}</SelectItem>
                <SelectItem value="clinical-team">Clinical Team</SelectItem>
                <SelectItem value="pharma-partners">Pharma Partners</SelectItem>
              </SelectContent>
            </Select>
            <button className="relative size-10 rounded-lg text-[#9f9fa9] flex justify-center items-center">
              <Bell className="size-5" />
              <span className="size-2 shadow-[0_0_6px_#00B5AD] rounded-full bg-[#00B5AD] absolute right-2 top-2" />
            </button>
            <button className="rounded-lg flex pl-1 pr-2 py-1 items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1740252117013-4fb21771e7ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxhdmF0YXIlMjBwb3J0cmFpdCUyMHNjaWVudGlzdCUyMHByb2Zlc3Npb25hbHxlbnwxfDJ8fHwxNzg0NDAyNjQ1fDA&ixlib=rb-4.1.0&q=80&w=400"
                alt="Profile"
                className="size-8 object-cover rounded-full"
                data-photoid="0piYmLeSgTQ"
                data-authorname="luthfi alfarizi"
                data-authorurl="https://unsplash.com/@luthfialfarizi"
                data-blurhash="LYNb}Bs:}jWC~Aj@W.R+9vj@xsWX"
              />
              <ChevronDown className="size-4 text-[#9f9fa9]" />
            </button>
          </header>
          <main className="flex p-8 flex-col flex-1 gap-8">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <h1 className="font-bold text-2xl leading-8 tracking-tight">
                  Executive Dashboard
                </h1>
                <p className="text-[#9f9fa9] text-sm leading-5">
                  Precision oncology knowledge graph — real-time biomedical
                  intelligence overview.
                </p>
              </div>
              <div className="rounded-lg bg-white/5 border-white/10 border-1 border-solid flex px-3 py-2 items-center gap-2">
                <Clock className="size-4 text-[#00B5AD]" />
                <span className="text-[#9f9fa9] text-xs leading-4">
                  Last sync 2 min ago
                </span>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-6">
              <Card className="backdrop-blur-xl shadow-lg shadow-black/20 bg-zinc-900/60 border-white/10 border-0 border-solid p-5 gap-3">
                <CardHeader className="p-0 flex-row justify-between items-center gap-0">
                  <div className="size-9 rounded-lg bg-emerald-500/15 flex justify-center items-center">
                    <Pill className="size-4 text-emerald-400" />
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-black/1 border-0 border-solid gap-1">
                    <TrendingUp className="size-3" />
                    +4.2%
                  </Badge>
                </CardHeader>
                <CardContent className="flex p-0 flex-col gap-1">
                  <span className="font-bold text-3xl leading-9 tracking-tight">
                    18,204
                  </span>
                  <span className="text-[#9f9fa9] text-xs leading-4">
                    Total Drugs
                  </span>
                </CardContent>
                <CardFooter className="p-0">
                  <svg viewBox="0 0 100 24" className="w-full h-6">
                    <polyline
                      fill="none"
                      stroke="oklch(0.696 0.17 162.48)"
                      strokeWidth="2"
                      points="0,18 15,15 30,17 45,10 60,12 75,6 90,8 100,3"
                    />
                  </svg>
                </CardFooter>
              </Card>
              <Card className="backdrop-blur-xl shadow-lg shadow-black/20 bg-zinc-900/60 border-white/10 border-0 border-solid p-5 gap-3">
                <CardHeader className="p-0 flex-row justify-between items-center gap-0">
                  <div className="size-9 rounded-lg bg-blue-500/15 flex justify-center items-center">
                    <Dna className="size-4 text-blue-400" />
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-black/1 border-0 border-solid gap-1">
                    <TrendingUp className="size-3" />
                    +2.8%
                  </Badge>
                </CardHeader>
                <CardContent className="flex p-0 flex-col gap-1">
                  <span className="font-bold text-3xl leading-9 tracking-tight">
                    24,891
                  </span>
                  <span className="text-[#9f9fa9] text-xs leading-4">
                    Total Genes
                  </span>
                </CardContent>
                <CardFooter className="p-0">
                  <svg viewBox="0 0 100 24" className="w-full h-6">
                    <polyline
                      fill="none"
                      stroke="oklch(0.546 0.245 262.881)"
                      strokeWidth="2"
                      points="0,14 15,16 30,11 45,13 60,8 75,10 90,5 100,6"
                    />
                  </svg>
                </CardFooter>
              </Card>
              <Card className="backdrop-blur-xl shadow-lg shadow-black/20 bg-zinc-900/60 border-white/10 border-0 border-solid p-5 gap-3">
                <CardHeader className="p-0 flex-row justify-between items-center gap-0">
                  <div className="size-9 rounded-lg bg-red-500/15 flex justify-center items-center">
                    <Activity className="size-4 text-red-400" />
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-black/1 border-0 border-solid gap-1">
                    <TrendingUp className="size-3" />
                    +1.5%
                  </Badge>
                </CardHeader>
                <CardContent className="flex p-0 flex-col gap-1">
                  <span className="font-bold text-3xl leading-9 tracking-tight">
                    3,472
                  </span>
                  <span className="text-[#9f9fa9] text-xs leading-4">
                    Total Diseases
                  </span>
                </CardContent>
                <CardFooter className="p-0">
                  <svg viewBox="0 0 100 24" className="w-full h-6">
                    <polyline
                      fill="none"
                      stroke="oklch(0.704 0.191 22.216)"
                      strokeWidth="2"
                      points="0,16 15,12 30,14 45,11 60,13 75,9 90,11 100,7"
                    />
                  </svg>
                </CardFooter>
              </Card>
              <Card className="backdrop-blur-xl shadow-lg shadow-black/20 bg-zinc-900/60 border-white/10 border-0 border-solid p-5 gap-3">
                <CardHeader className="p-0 flex-row justify-between items-center gap-0">
                  <div className="size-9 rounded-lg bg-amber-500/15 flex justify-center items-center">
                    <Zap className="size-4 text-amber-400" />
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-black/1 border-0 border-solid gap-1">
                    <TrendingUp className="size-3" />
                    +6.9%
                  </Badge>
                </CardHeader>
                <CardContent className="flex p-0 flex-col gap-1">
                  <span className="font-bold text-3xl leading-9 tracking-tight">
                    92,318
                  </span>
                  <span className="text-[#9f9fa9] text-xs leading-4">
                    Total Mutations
                  </span>
                </CardContent>
                <CardFooter className="p-0">
                  <svg viewBox="0 0 100 24" className="w-full h-6">
                    <polyline
                      fill="none"
                      stroke="oklch(0.769 0.188 70.08)"
                      strokeWidth="2"
                      points="0,20 15,16 30,17 45,12 60,10 75,8 90,5 100,2"
                    />
                  </svg>
                </CardFooter>
              </Card>
              <Card className="backdrop-blur-xl shadow-lg shadow-black/20 bg-zinc-900/60 border-white/10 border-0 border-solid p-5 gap-3">
                <CardHeader className="p-0 flex-row justify-between items-center gap-0">
                  <div className="size-9 rounded-lg bg-purple-500/15 flex justify-center items-center">
                    <Beaker className="size-4 text-purple-400" />
                  </div>
                  <Badge className="bg-red-500/15 text-red-400 border-black/1 border-0 border-solid gap-1">
                    <TrendingDown className="size-3" />
                    -0.7%
                  </Badge>
                </CardHeader>
                <CardContent className="flex p-0 flex-col gap-1">
                  <span className="font-bold text-3xl leading-9 tracking-tight">
                    7,640
                  </span>
                  <span className="text-[#9f9fa9] text-xs leading-4">
                    Clinical Trials
                  </span>
                </CardContent>
                <CardFooter className="p-0">
                  <svg viewBox="0 0 100 24" className="w-full h-6">
                    <polyline
                      fill="none"
                      stroke="oklch(0.627 0.265 303.9)"
                      strokeWidth="2"
                      points="0,10 15,12 30,9 45,13 60,11 75,14 90,12 100,13"
                    />
                  </svg>
                </CardFooter>
              </Card>
              <Card className="backdrop-blur-xl shadow-lg shadow-black/20 bg-zinc-900/60 border-white/10 border-0 border-solid p-5 gap-3">
                <CardHeader className="p-0 flex-row justify-between items-center gap-0">
                  <div className="size-9 rounded-lg bg-cyan-500/15 flex justify-center items-center">
                    <BookOpen className="size-4 text-cyan-400" />
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-black/1 border-0 border-solid gap-1">
                    <TrendingUp className="size-3" />
                    +9.3%
                  </Badge>
                </CardHeader>
                <CardContent className="flex p-0 flex-col gap-1">
                  <span className="font-bold text-3xl leading-9 tracking-tight">
                    146,782
                  </span>
                  <span className="text-[#9f9fa9] text-xs leading-4">
                    Publications
                  </span>
                </CardContent>
                <CardFooter className="p-0">
                  <svg viewBox="0 0 100 24" className="w-full h-6">
                    <polyline
                      fill="none"
                      stroke="oklch(0.696 0.17 162.48)"
                      strokeWidth="2"
                      points="0,18 15,14 30,15 45,10 60,8 75,9 90,4 100,3"
                    />
                  </svg>
                </CardFooter>
              </Card>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <Card className="col-span-2 backdrop-blur-xl shadow-lg shadow-black/20 bg-zinc-900/60 border-white/10 border-0 border-solid p-6 gap-4">
                <CardHeader className="p-0 flex-row justify-between items-center gap-0">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="font-bold text-base leading-6">
                      Recent Graph Activity
                    </CardTitle>
                    <CardDescription className="text-xs leading-4">{`Live knowledge graph ingestion & curation events`}</CardDescription>
                  </div>
                  <Tabs defaultValue="all">
                    <TabsList className="bg-white/5">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="genes">Genes</TabsTrigger>
                      <TabsTrigger value="drugs">Drugs</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent className="flex p-0 flex-col gap-0">
                  <div className="border-white/60 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex py-3 gap-4">
                    <div className="size-9 shrink-0 rounded-lg bg-blue-500/15 flex justify-center items-center">
                      <Dna className="size-4 text-blue-400" />
                    </div>
                    <div className="flex flex-col flex-1 gap-0.5">
                      <p className="text-sm leading-5">
                        <span className="font-semibold text-blue-400">
                          EGFR
                        </span>
                        gene linked to 12 new resistance mutations
                      </p>
                      <span className="text-[#9f9fa9] text-xs leading-4">
                        Curated by AI Pipeline · 3 min ago
                      </span>
                    </div>
                    <Badge className="bg-blue-500/15 text-blue-400 border-black/1 border-0 border-solid h-fit">
                      Gene
                    </Badge>
                  </div>
                  <div className="border-white/60 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex py-3 gap-4">
                    <div className="size-9 shrink-0 rounded-lg bg-emerald-500/15 flex justify-center items-center">
                      <Pill className="size-4 text-emerald-400" />
                    </div>
                    <div className="flex flex-col flex-1 gap-0.5">
                      <p className="text-sm leading-5">
                        <span className="font-semibold text-emerald-400">
                          Osimertinib
                        </span>
                        mapped to 4 new clinical trial nodes
                      </p>
                      <span className="text-[#9f9fa9] text-xs leading-4">
                        Ingested from ClinicalTrials.gov · 14 min ago
                      </span>
                    </div>
                    <Badge className="bg-emerald-500/15 text-emerald-400 border-black/1 border-0 border-solid h-fit">
                      Drug
                    </Badge>
                  </div>
                  <div className="border-white/60 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex py-3 gap-4">
                    <div className="size-9 shrink-0 rounded-lg bg-red-500/15 flex justify-center items-center">
                      <Activity className="size-4 text-red-400" />
                    </div>
                    <div className="flex flex-col flex-1 gap-0.5">
                      <p className="text-sm leading-5">
                        <span className="font-semibold text-red-400">
                          Non-Small Cell Lung Cancer
                        </span>
                        relationship graph expanded
                      </p>
                      <span className="text-[#9f9fa9] text-xs leading-4">
                        System curation · 38 min ago
                      </span>
                    </div>
                    <Badge className="bg-red-500/15 text-red-400 border-black/1 border-0 border-solid h-fit">
                      Disease
                    </Badge>
                  </div>
                  <div className="border-white/60 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex py-3 gap-4">
                    <div className="size-9 shrink-0 rounded-lg bg-amber-500/15 flex justify-center items-center">
                      <Zap className="size-4 text-amber-400" />
                    </div>
                    <div className="flex flex-col flex-1 gap-0.5">
                      <p className="text-sm leading-5">
                        <span className="font-semibold text-amber-400">
                          T790M
                        </span>
                        mutation flagged as high-evidence resistance marker
                      </p>
                      <span className="text-[#9f9fa9] text-xs leading-4">
                        Evidence Engine · 1 hr ago
                      </span>
                    </div>
                    <Badge className="bg-amber-500/15 text-amber-400 border-black/1 border-0 border-solid h-fit">
                      Mutation
                    </Badge>
                  </div>
                  <div className="border-white/60 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex py-3 gap-4">
                    <div className="size-9 shrink-0 rounded-lg bg-purple-500/15 flex justify-center items-center">
                      <Beaker className="size-4 text-purple-400" />
                    </div>
                    <div className="flex flex-col flex-1 gap-0.5">
                      <p className="text-sm leading-5">
                        <span className="font-semibold text-purple-400">
                          NCT05398094
                        </span>
                        Phase III trial updated to Recruiting
                      </p>
                      <span className="text-[#9f9fa9] text-xs leading-4">
                        Sync agent · 2 hr ago
                      </span>
                    </div>
                    <Badge className="bg-purple-500/15 text-purple-400 border-black/1 border-0 border-solid h-fit">
                      Trial
                    </Badge>
                  </div>
                  <div className="flex py-3 gap-4">
                    <div className="size-9 shrink-0 rounded-lg bg-cyan-500/15 flex justify-center items-center">
                      <BookOpen className="size-4 text-cyan-400" />
                    </div>
                    <div className="flex flex-col flex-1 gap-0.5">
                      <p className="text-sm leading-5">
                        1,204 new
                        <span className="font-semibold text-cyan-400">
                          publications
                        </span>
                        indexed with citation graph links
                      </p>
                      <span className="text-[#9f9fa9] text-xs leading-4">
                        PubMed connector · 3 hr ago
                      </span>
                    </div>
                    <Badge className="bg-cyan-500/15 text-cyan-400 border-black/1 border-0 border-solid h-fit">
                      Publication
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-600/20 via-card/60 to-card/60 backdrop-blur-xl shadow-lg shadow-purple-900/20 border-purple-500/30 border-0 border-solid p-6 gap-4">
                <CardHeader className="p-0 flex-row justify-between items-center gap-0">
                  <div className="flex items-center gap-2">
                    <div className="size-8 bg-gradient-to-br from-[#7c3aed] to-[#a855f7] shadow-lg shadow-purple-500/30 rounded-lg flex justify-center items-center">
                      <Sparkles className="size-4 text-white" />
                    </div>
                    <CardTitle className="font-bold text-base leading-6">
                      AI Insights
                    </CardTitle>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-300 border-black/1 border-0 border-solid">
                    Beta
                  </Badge>
                </CardHeader>
                <CardContent className="flex p-0 flex-col gap-4">
                  <p className="text-[#9f9fa9] text-xs leading-4">
                    Generated from 2.1M graph relationships in the last 24h.
                  </p>
                  <div className="flex gap-3">
                    <TrendingUp className="size-4 shrink-0 text-[#00B5AD] mt-0.5" />
                    <p className="leading-relaxed text-sm leading-5">
                      KRAS G12C inhibitors show a
                      <span className="font-semibold text-[#00B5AD]">
                        31% rise
                      </span>
                      in trial linkage this quarter.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <GitBranch className="size-4 shrink-0 text-purple-300 mt-0.5" />
                    <p className="leading-relaxed text-sm leading-5">
                      Emerging resistance cluster detected around
                      <span className="font-semibold text-purple-300">
                        EGFR C797S
                      </span>
                      .
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Target className="size-4 shrink-0 text-amber-400 mt-0.5" />
                    <p className="leading-relaxed text-sm leading-5">
                      3 under-explored drug–gene pairs recommended for review.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Lightbulb className="size-4 shrink-0 text-cyan-400 mt-0.5" />
                    <p className="leading-relaxed text-sm leading-5">
                      Literature signal suggests repurposing potential for
                      <span className="font-semibold text-cyan-400">
                        Selumetinib
                      </span>
                      .
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="p-0">
                  <Button className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white border-black/1 border-0 border-solid gap-2 w-full">
                    <MessageSquare className="size-4" />
                    Ask AI Copilot
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <Card className="bg-gradient-to-br from-purple-600/15 to-card/60 backdrop-blur-xl border-purple-500/30 border-0 border-solid hidden p-6 gap-4">
              <CardHeader className="p-0 flex-row justify-between items-center gap-0">
                <CardTitle className="font-bold text-sm leading-5 flex items-center gap-2">
                  <Sparkles className="size-4 text-purple-300" />
                  AI Copilot Suggestions
                </CardTitle>
                <button className="text-[#9f9fa9]">
                  <X className="size-4" />
                </button>
              </CardHeader>
              <CardContent className="flex p-0 flex-wrap gap-2">
                <Badge className="cursor-pointer bg-white/5 text-neutral-50 border-white/10 border-0 border-solid">
                  Summarize EGFR resistance landscape
                </Badge>
                <Badge className="cursor-pointer bg-white/5 text-neutral-50 border-white/10 border-0 border-solid">
                  Compare KRAS inhibitors
                </Badge>
                <Badge className="cursor-pointer bg-white/5 text-neutral-50 border-white/10 border-0 border-solid">
                  Find trials for T790M
                </Badge>
              </CardContent>
            </Card>
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <h2 className="font-bold text-lg leading-7 tracking-tight">
                  Network Statistics
                </h2>
                <p className="text-[#9f9fa9] text-sm leading-5">{`Graph topology & entity relationship breakdown`}</p>
              </div>
              <div className="rounded-lg bg-white/5 border-white/10 border-1 border-solid flex px-4 py-2 items-center gap-3">
                <Waves className="size-4 text-[#00B5AD]" />
                <span className="text-sm leading-5">Physics Simulation</span>
                <Switch defaultChecked={true} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <Card className="backdrop-blur-xl shadow-lg shadow-black/20 bg-zinc-900/60 border-white/10 border-0 border-solid p-6 gap-4">
                <CardHeader className="p-0 gap-0">
                  <CardTitle className="font-bold text-base leading-6">
                    Relationship Distribution
                  </CardTitle>
                  <CardDescription className="text-xs leading-4">
                    By edge type across the graph
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex p-0 flex-col items-center gap-4">
                  <ChartContainer
                    config={{
                      genes: {
                        label: "Gene–Drug",
                        color: "oklch(0.546 0.245 262.881)",
                      },
                      mutations: {
                        label: "Gene–Mutation",
                        color: "oklch(0.769 0.188 70.08)",
                      },
                      trials: {
                        label: "Drug–Trial",
                        color: "oklch(0.627 0.265 303.9)",
                      },
                      disease: {
                        label: "Disease–Gene",
                        color: "oklch(0.704 0.191 22.216)",
                      },
                    }}
                    className="w-full h-50"
                  >
                    <RechartsPieChart>
                      <ChartTooltip />
                      <Pie
                        data={[
                          {
                            name: "Gene–Drug",
                            value: 38,
                            fill: "oklch(0.546 0.245 262.881)",
                          },
                          {
                            name: "Gene–Mutation",
                            value: 27,
                            fill: "oklch(0.769 0.188 70.08)",
                          },
                          {
                            name: "Drug–Trial",
                            value: 19,
                            fill: "oklch(0.627 0.265 303.9)",
                          },
                          {
                            name: "Disease–Gene",
                            value: 16,
                            fill: "oklch(0.704 0.191 22.216)",
                          },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={85}
                        strokeWidth={2}
                        stroke="oklch(0.141 0.005 285.823)"
                      />
                    </RechartsPieChart>
                  </ChartContainer>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-blue-400" />
                      <span className="text-[#9f9fa9] text-xs leading-4">
                        Gene–Drug 38%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-amber-400" />
                      <span className="text-[#9f9fa9] text-xs leading-4">
                        Gene–Mutation 27%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-purple-400" />
                      <span className="text-[#9f9fa9] text-xs leading-4">
                        Drug–Trial 19%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-red-400" />
                      <span className="text-[#9f9fa9] text-xs leading-4">
                        Disease–Gene 16%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="backdrop-blur-xl shadow-lg shadow-black/20 bg-zinc-900/60 border-white/10 border-0 border-solid p-6 gap-4">
                <CardHeader className="p-0 gap-0">
                  <CardTitle className="font-bold text-base leading-6">
                    Top Connected Genes
                  </CardTitle>
                  <CardDescription className="text-xs leading-4">
                    By relationship degree centrality
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ChartContainer
                    config={{
                      conn: {
                        label: "Connections",
                        color: "oklch(0.546 0.245 262.881)",
                      },
                    }}
                    className="w-full h-60"
                  >
                    <RechartsBarChart
                      data={[
                        { gene: "TP53", conn: 4210 },
                        { gene: "EGFR", conn: 3890 },
                        { gene: "KRAS", conn: 3320 },
                        { gene: "BRAF", conn: 2740 },
                        { gene: "PIK3CA", conn: 2110 },
                        { gene: "ALK", conn: 1680 },
                      ]}
                      layout="vertical"
                      margin={{ left: 12 }}
                    >
                      <CartesianGrid
                        horizontal={false}
                        stroke="oklch(1 0 0 / 8%)"
                      />
                      <XAxis type="number" hide={true} />
                      <YAxis
                        type="category"
                        dataKey="gene"
                        tickLine={false}
                        axisLine={false}
                        width={54}
                        tick={{
                          fill: "oklch(0.705 0.015 286.067)",
                          fontSize: 12,
                        }}
                      />
                      <ChartTooltip />
                      <Bar
                        dataKey="conn"
                        fill="oklch(0.546 0.245 262.881)"
                        radius={[0, 6, 6, 0]}
                        barSize={18}
                      />
                    </RechartsBarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="backdrop-blur-xl shadow-lg shadow-black/20 bg-zinc-900/60 border-white/10 border-0 border-solid p-6 gap-4">
                <CardHeader className="p-0 gap-0">
                  <CardTitle className="font-bold text-base leading-6">
                    Top Targeted Drugs
                  </CardTitle>
                  <CardDescription className="text-xs leading-4">
                    Ranked by graph target coverage
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex p-0 flex-col gap-0">
                  <div className="border-white/60 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex py-3 items-center gap-3">
                    <span className="font-bold text-[#9f9fa9] text-sm leading-5 w-5">
                      1
                    </span>
                    <div className="size-8 rounded-lg bg-emerald-500/15 flex justify-center items-center">
                      <Pill className="size-4 text-emerald-400" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-semibold text-sm leading-5">
                        Osimertinib
                      </span>
                      <span className="text-[#9f9fa9] text-xs leading-4">
                        842 targets · EGFR
                      </span>
                    </div>
                    <Star />
                  </div>
                  <div className="border-white/60 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex py-3 items-center gap-3">
                    <span className="font-bold text-[#9f9fa9] text-sm leading-5 w-5">
                      2
                    </span>
                    <div className="size-8 rounded-lg bg-emerald-500/15 flex justify-center items-center">
                      <Pill className="size-4 text-emerald-400" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-semibold text-sm leading-5">
                        Sotorasib
                      </span>
                      <span className="text-[#9f9fa9] text-xs leading-4">
                        716 targets · KRAS G12C
                      </span>
                    </div>
                    <Star />
                  </div>
                  <div className="border-white/60 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex py-3 items-center gap-3">
                    <span className="font-bold text-[#9f9fa9] text-sm leading-5 w-5">
                      3
                    </span>
                    <div className="size-8 rounded-lg bg-emerald-500/15 flex justify-center items-center">
                      <Pill className="size-4 text-emerald-400" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-semibold text-sm leading-5">
                        Trastuzumab
                      </span>
                      <span className="text-[#9f9fa9] text-xs leading-4">
                        689 targets · HER2
                      </span>
                    </div>
                    <Star />
                  </div>
                  <div className="border-white/60 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex py-3 items-center gap-3">
                    <span className="font-bold text-[#9f9fa9] text-sm leading-5 w-5">
                      4
                    </span>
                    <div className="size-8 rounded-lg bg-emerald-500/15 flex justify-center items-center">
                      <Pill className="size-4 text-emerald-400" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-semibold text-sm leading-5">
                        Vemurafenib
                      </span>
                      <span className="text-[#9f9fa9] text-xs leading-4">
                        574 targets · BRAF V600E
                      </span>
                    </div>
                    <Star className="size-4 text-[#9f9fa9]" />
                  </div>
                  <div className="flex py-3 items-center gap-3">
                    <span className="font-bold text-[#9f9fa9] text-sm leading-5 w-5">
                      5
                    </span>
                    <div className="size-8 rounded-lg bg-emerald-500/15 flex justify-center items-center">
                      <Pill className="size-4 text-emerald-400" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-semibold text-sm leading-5">
                        Pembrolizumab
                      </span>
                      <span className="text-[#9f9fa9] text-xs leading-4">
                        512 targets · PD-1
                      </span>
                    </div>
                    <Star className="size-4 text-[#9f9fa9]" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}


