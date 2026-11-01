import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Maximize2,
  Clock,
  RotateCw,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Trash2,
  ArrowRight,
  Server,
  Radio,
  ArrowLeftRight,
  Send,
  Users,
  GitFork,
  Globe,
  AppWindow,
  Cpu,
  Building2,
  Monitor,
  Cloud,
  Check,
  PanelLeftClose,
  Activity,
  Bell,
  Tv,
  Code2,
  SlidersHorizontal,
  Video,
  Shield,
  Layers,
  History,
  Target,
  CheckCircle2,
  XCircle,
  Minus,
  Settings,
  Folder
} from 'lucide-react';

// Left sidebar menu items
const SIDEBAR_ITEMS = [
  { id: 'smart-search', label: '智搜', icon: Search, active: true },
  { id: 'smart-trace', label: '智溯', icon: History },
  { id: 'cloud', label: '逸云', icon: Cloud },
  { id: 'topology', label: '拓扑', icon: GitFork },
  { id: 'alert', label: '告警', icon: Bell },
  { id: 'monitor', label: '监控', icon: Activity },
  { id: 'dashboard', label: '大屏', icon: Tv },
  { id: 'decode', label: '解码', icon: Code2 },
  { id: 'config', label: '配置', icon: SlidersHorizontal },
  { id: 'netflow', label: 'NetFlow', icon: ArrowLeftRight },
  { id: 'av', label: '音视频', icon: Video },
  { id: 'firewall', label: '防火墙', icon: Shield },
  { id: 'load', label: '负载', icon: Server },
];

// Tabs under header
const TABS = [
  { id: 'host', label: '主机', icon: Server },
  { id: 'ip_session', label: 'IP会话', icon: Radio },
  { id: 'tcp_session', label: 'TCP会话', icon: ArrowLeftRight },
  { id: 'udp_session', label: 'UDP会话', icon: Send },
  { id: 'server_access', label: '服务器访问', icon: Users },
  { id: 'server_tuple', label: '服务器二元组', icon: GitFork },
  { id: 'domain', label: '域名', icon: Globe },
  { id: 'app', label: '应用', icon: AppWindow },
  { id: 'port', label: '端口', icon: Cpu },
  { id: 'site', label: '站点', icon: Building2 },
  { id: 'mac', label: 'MAC', icon: Monitor },
  { id: 'subnet', label: '网段', icon: Cloud },
];

// Initial search history chips
const INITIAL_HISTORY = [
  { id: '1', label: '主机: 172.17.3.2' },
  { id: '2', label: '站点: 上海站点' },
  { id: '3', label: 'TCP会话: 210.22.73.66', arrow: true, target: '58.20.30.214' },
  { id: '4', label: 'TCP会话: 210.22.73.66', arrow: true, target: '172.17.3.2' },
  { id: '5', label: 'TCP会话: 210.22.73.66', arrow: true, target: '-' },
  { id: '6', label: 'IP会话: 210.22.73.66' },
  { id: '7', label: '主机: 210.22.73.66' },
  { id: '8', label: 'TCP会话: 58.49.159.80', arrow: true, target: '-' },
  { id: '9', label: 'TCP会话: -', arrow: true, target: '58.49.159.80' },
  { id: '10', label: 'TCP会话: -', arrow: true, target: '172.17.0.145:80' },
];

// Dropdown interface item structure for Classic Mode
interface TargetItem {
  id: string;
  name: string;
  type: 'interface' | 'vlan' | 'analysis_group';
  checked: boolean;
}

interface TargetGroup {
  id: string;
  name: string;
  type: 'interface' | 'vlan' | 'analysis_group';
  items: TargetItem[];
}

const INITIAL_GROUPS: TargetGroup[] = [
  {
    id: 'interface_group',
    name: '接口',
    type: 'interface',
    items: [
      { id: 'if-1', name: 'Interface 1 / DataCenter-SH', type: 'interface', checked: true },
      { id: 'if-2', name: '接口1 / Private_Cloud', type: 'interface', checked: true },
      { id: 'if-3', name: '接口1 / vProbe', type: 'interface', checked: false },
      { id: 'if-4', name: '容器流量 / 云探针', type: 'interface', checked: true },
      { id: 'if-5', name: '接口1 / modbus', type: 'interface', checked: true },
      { id: 'if-6', name: '接口1 / 七层', type: 'interface', checked: true },
      { id: 'if-7', name: '容器前置计算 / 容器-前置计算', type: 'interface', checked: false },
    ],
  },
  {
    id: 'vlan_group',
    name: 'Vlan虚链路',
    type: 'vlan',
    items: [
      { id: 'vl-1', name: 'V1(V1)/Interface 1/DataCenter-SH', type: 'vlan', checked: false },
      { id: 'vl-2', name: 'Internet Gateway(V1001)/Interface 1/DataCenter-SH', type: 'vlan', checked: false },
      { id: 'vl-3', name: 'Business Zone 2(V1002)/Interface 1/DataCenter-SH', type: 'vlan', checked: false },
      { id: 'vl-4', name: 'Core Switch(V1003)/Interface 1/DataCenter-SH', type: 'vlan', checked: false },
      { id: 'vl-5', name: 'Business Zone 1(V1004)/Interface 1/DataCenter-SH', type: 'vlan', checked: false },
      { id: 'vl-6', name: 'Link LB(V1005)/Interface 1/DataCenter-SH', type: 'vlan', checked: false },
      { id: 'vl-7', name: 'V16777215/Interface 1/DataCenter-SH', type: 'vlan', checked: false },
    ],
  },
  {
    id: 'analysis_group',
    name: '分析组',
    type: 'analysis_group',
    items: [
      { id: 'ag-1', name: 'vlan-jack', type: 'analysis_group', checked: false },
      { id: 'ag-2', name: '单接口1', type: 'analysis_group', checked: false },
      { id: 'ag-3', name: '智溯测试聚合链路', type: 'analysis_group', checked: false },
      { id: 'ag-4', name: 'dscp', type: 'analysis_group', checked: false },
      { id: 'ag-5', name: '聚合链路3', type: 'analysis_group', checked: false },
      { id: 'ag-6', name: '华三复现接口分析组', type: 'analysis_group', checked: false },
      { id: 'ag-7', name: '测试vlan', type: 'analysis_group', checked: false },
      { id: 'ag-8', name: '单向回放分析组', type: 'analysis_group', checked: false },
      { id: 'ag-9', name: 'VLAN分析组', type: 'analysis_group', checked: false },
      { id: 'ag-10', name: 'dashboard-接口分析组', type: 'analysis_group', checked: false },
      { id: 'ag-11', name: '核心交换机分析组', type: 'analysis_group', checked: false },
      { id: 'ag-12', name: '出口防火墙分析组', type: 'analysis_group', checked: false },
      { id: 'ag-13', name: '生产网段流量分析', type: 'analysis_group', checked: false },
      { id: 'ag-14', name: '研发网段镜像组', type: 'analysis_group', checked: false },
      { id: 'ag-15', name: 'DNS与基础服务分析组', type: 'analysis_group', checked: false },
    ],
  },
];

// Directory Tree item structure
interface DirectoryNode {
  id: string;
  name: string;
  isFolder?: boolean;
  iconType?: 'fork' | 'site' | 'datacenter' | 'interface' | 'vlan';
  checked?: boolean;
  expanded?: boolean;
  children?: DirectoryNode[];
}

// 1. LINK DIRECTORY TREE (链路目录模式: 接口与VLAN)
const INITIAL_LINK_DIRECTORY_TREE: DirectoryNode[] = [
  {
    id: 'link-dir-ceshi',
    name: 'ceshi',
    isFolder: true,
    expanded: true,
    children: [
      {
        id: 'link-node-dc',
        name: 'DataCenter-SH',
        isFolder: true,
        iconType: 'datacenter',
        expanded: true,
        children: [
          {
            id: 'link-node-if1',
            name: 'Interface 1',
            isFolder: true,
            iconType: 'interface',
            expanded: true,
            checked: true,
            children: [
              { id: 'vlan-sub-1', name: 'V1(V1)', iconType: 'vlan', checked: true },
              { id: 'vlan-sub-2', name: 'Internet Gateway(V1001)', iconType: 'vlan', checked: true },
              { id: 'vlan-sub-3', name: 'Business Zone 2(V1002)', iconType: 'vlan', checked: false },
              { id: 'vlan-sub-4', name: 'Core Switch(V1003)', iconType: 'vlan', checked: true },
              { id: 'vlan-sub-5', name: 'Business Zone 1(V1004)', iconType: 'vlan', checked: true },
              { id: 'vlan-sub-6', name: 'Link LB(V1005)', iconType: 'vlan', checked: false },
              { id: 'vlan-sub-7', name: 'V16777215', iconType: 'vlan', checked: false },
            ],
          },
        ],
      },
      {
        id: 'link-dir-111',
        name: '111',
        isFolder: true,
        expanded: false,
        children: [
          { id: 'link-dir-111-sub', name: 'Interface 2 / Cloud', iconType: 'interface', checked: false },
        ],
      },
    ],
  },
  {
    id: 'link-dir-test',
    name: 'test',
    isFolder: true,
    expanded: true,
    children: [
      {
        id: 'link-dir-1',
        name: '1',
        isFolder: true,
        expanded: false,
        children: [
          { id: 'link-dir-1-sub', name: 'vProbe-SH', iconType: 'interface', checked: false },
        ],
      },
    ],
  },
  {
    id: 'link-dir-front-test',
    name: 'front-Test',
    isFolder: true,
    expanded: true,
    children: [
      { id: 'ft-dd', name: 'dd', isFolder: true, expanded: false },
      { id: 'ft-a', name: 'a', isFolder: true, expanded: false },
      { id: 'ft-aa', name: 'aa', isFolder: true, expanded: false },
      { id: 'ft-aaa', name: 'aaa', isFolder: true, expanded: false },
      { id: 'ft-aaaa', name: 'aaaa', isFolder: true, expanded: false },
      { id: 'ft-aaaaa', name: 'aaaaa', isFolder: true, expanded: false },
      { id: 'ft-b', name: 'b', isFolder: true, expanded: false },
      { id: 'ft-bb', name: 'bb', isFolder: true, expanded: false },
      { id: 'ft-bbb', name: 'bbb', isFolder: true, expanded: false },
      { id: 'ft-bbbb', name: 'bbbb', isFolder: true, expanded: false },
    ],
  },
];

// 2. ANALYSIS GROUP DIRECTORY TREE (分析组目录模式)
const INITIAL_ANALYSIS_DIRECTORY_TREE: DirectoryNode[] = [
  {
    id: 'dir-vlan-group',
    name: 'vlan分析组',
    isFolder: true,
    expanded: true,
    children: [
      {
        id: 'dir-vlan-a',
        name: 'a',
        isFolder: true,
        expanded: true,
        children: [
          { id: 'node-hs2', name: '华三复现2', iconType: 'fork', checked: false },
          {
            id: 'node-hs-interface',
            name: '华三复现接口分析组',
            iconType: 'fork',
            isFolder: true,
            expanded: false,
            checked: false,
            children: [
              { id: 'node-hs-sub-1', name: '复现接口-GE0/0/1', iconType: 'fork', checked: false },
              { id: 'node-hs-sub-2', name: '复现接口-GE0/0/2', iconType: 'fork', checked: false },
            ],
          },
          { id: 'node-hs', name: '华三复现', iconType: 'fork', checked: false },
          { id: 'node-dscp', name: 'dscp', iconType: 'fork', checked: false },
          { id: 'node-multi-if', name: '多接口分析组', iconType: 'fork', checked: false },
          { id: 'node-vlan-sub', name: 'VLAN分析组子对象...', iconType: 'fork', checked: false },
        ],
      },
      {
        id: 'dir-vlan-b',
        name: 'b',
        isFolder: true,
        expanded: true,
        children: [
          { id: 'node-vlan-site', name: 'vlan-站点', iconType: 'fork', checked: false },
          { id: 'node-vlan-group-item', name: 'vlan分析组', iconType: 'fork', checked: false },
          { id: 'node-if-group-234', name: '接口分析组234', iconType: 'fork', checked: false },
          { id: 'node-vlan-jack', name: 'vlan-jack', iconType: 'fork', checked: false },
        ],
      },
    ],
  },
  {
    id: 'dir-if-group',
    name: '接口分析组',
    isFolder: true,
    expanded: true,
    children: [
      { id: 'node-all-if', name: '全部接口', iconType: 'fork', checked: false },
      {
        id: 'node-if-site-sub',
        name: '接口-站点子链路',
        iconType: 'fork',
        isFolder: true,
        expanded: true,
        checked: false,
        children: [
          { id: 'node-undef-site', name: '未定义站点', iconType: 'site', checked: false },
        ],
      },
    ],
  },
  {
    id: 'dir-vlan-cat',
    name: 'VLAN分组',
    isFolder: true,
    expanded: false,
    children: [
      { id: 'node-vlan-cat-1', name: 'VLAN-100核心流量', iconType: 'fork', checked: false },
      { id: 'node-vlan-cat-2', name: 'VLAN-200办公网络', iconType: 'fork', checked: false },
    ],
  },
  {
    id: 'node-vlan-test',
    name: 'vlan分析组测试',
    iconType: 'fork',
    checked: false,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('host');
  const [activeNav, setActiveNav] = useState('smart-search');
  const [historyList, setHistoryList] = useState(INITIAL_HISTORY);
  const [searchVal, setSearchVal] = useState('');
  const [timeRange] = useState('2026-11-01 22:48  ~  2026-11-01 22:53');

  // Mode: strictly 'classic' (经典模式) or 'directory' (目录模式)
  const [viewMode, setViewMode] = useState<'classic' | 'directory'>('classic');
  const [isConfigMenuOpen, setIsConfigMenuOpen] = useState(false);

  // Dropdown target objects state
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  // CLASSIC MODE accordion groups expand state
  const [groups, setGroups] = useState<TargetGroup[]>(INITIAL_GROUPS);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    interface_group: true,
    vlan_group: false,
    analysis_group: false,
  });

  // DIRECTORY MODE: Expanded state for the two categories: 'link' (链路) & 'analysis' (分析组)
  // Uses the exact interactive style from 图1 ([ ] 链路 (14条) >, [ ] 分析组 (15条) >)
  const [expandedDirectoryGroups, setExpandedDirectoryGroups] = useState<Record<string, boolean>>({
    link: true,
    analysis: false,
  });

  // Directory trees state
  const [linkDirectoryTree, setLinkDirectoryTree] = useState<DirectoryNode[]>(INITIAL_LINK_DIRECTORY_TREE);
  const [analysisDirectoryTree, setAnalysisDirectoryTree] = useState<DirectoryNode[]>(INITIAL_ANALYSIS_DIRECTORY_TREE);

  const [filterMode, setFilterMode] = useState<'all' | 'selected' | 'unselected'>('all');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const configMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsConfigMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper to extract leaves from tree
  const getDirectoryLeaves = (nodes: DirectoryNode[]): DirectoryNode[] => {
    let leaves: DirectoryNode[] = [];
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        if (node.checked) {
          leaves.push(node);
        }
        leaves = leaves.concat(getDirectoryLeaves(node.children));
      } else {
        leaves.push(node);
      }
    }
    return leaves;
  };

  // Compute selected items
  let selectedItems: { id: string; name: string }[] = [];
  if (viewMode === 'classic') {
    selectedItems = groups.flatMap(g => g.items).filter(i => i.checked);
  } else {
    const linkLeaves = getDirectoryLeaves(linkDirectoryTree).filter(i => i.checked);
    const analysisLeaves = getDirectoryLeaves(analysisDirectoryTree).filter(i => i.checked);
    selectedItems = linkLeaves.length > 0 ? linkLeaves : analysisLeaves;
  }

  const firstSelected = selectedItems[0];
  const additionalCount = Math.max(0, selectedItems.length - 1);

  // CLASSIC MODE: Toggle item check - Mutually exclusive across types
  const toggleItem = (groupId: string, itemId: string) => {
    setGroups(prev =>
      prev.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            items: g.items.map(item =>
              item.id === itemId ? { ...item, checked: !item.checked } : item
            ),
          };
        }
        return {
          ...g,
          items: g.items.map(item => ({ ...item, checked: false })),
        };
      })
    );
  };

  // CLASSIC MODE: Toggle group check
  const toggleGroup = (groupId: string) => {
    setGroups(prev =>
      prev.map(g => {
        if (g.id === groupId) {
          const allChecked = g.items.every(i => i.checked);
          return {
            ...g,
            items: g.items.map(i => ({ ...i, checked: !allChecked })),
          };
        }
        return {
          ...g,
          items: g.items.map(item => ({ ...item, checked: false })),
        };
      })
    );
  };

  // CLASSIC MODE: Toggle group accordion
  const toggleGroupExpand = (groupId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // DIRECTORY MODE: Toggle category accordion expand
  const toggleDirectoryGroupExpand = (groupKey: 'link' | 'analysis', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedDirectoryGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  // DIRECTORY MODE: Toggle category group checkbox
  const toggleDirectoryCategoryCheck = (category: 'link' | 'analysis', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (category === 'link') {
      const leaves = getDirectoryLeaves(linkDirectoryTree);
      const allChecked = leaves.every(i => i.checked);
      const setTreeCheck = (nodes: DirectoryNode[], targetChecked: boolean): DirectoryNode[] => {
        return nodes.map(n => ({
          ...n,
          checked: targetChecked,
          children: n.children ? setTreeCheck(n.children, targetChecked) : undefined,
        }));
      };
      setLinkDirectoryTree(prev => setTreeCheck(prev, !allChecked));
      // Clear analysis group (mutual exclusivity)
      setAnalysisDirectoryTree(prev => setTreeCheck(prev, false));
    } else {
      const leaves = getDirectoryLeaves(analysisDirectoryTree);
      const allChecked = leaves.every(i => i.checked);
      const setTreeCheck = (nodes: DirectoryNode[], targetChecked: boolean): DirectoryNode[] => {
        return nodes.map(n => ({
          ...n,
          checked: targetChecked,
          children: n.children ? setTreeCheck(n.children, targetChecked) : undefined,
        }));
      };
      setAnalysisDirectoryTree(prev => setTreeCheck(prev, !allChecked));
      // Clear link group (mutual exclusivity)
      setLinkDirectoryTree(prev => setTreeCheck(prev, false));
    }
  };

  // DIRECTORY MODE: Toggle node checked state for link tree (链路)
  const toggleLinkDirectoryNodeCheck = (nodeId: string) => {
    // Clear analysis tree (mutual exclusivity)
    const clearTree = (nodes: DirectoryNode[]): DirectoryNode[] => {
      return nodes.map(n => ({
        ...n,
        checked: false,
        children: n.children ? clearTree(n.children) : undefined,
      }));
    };
    setAnalysisDirectoryTree(prev => clearTree(prev));

    const updateNode = (nodes: DirectoryNode[]): DirectoryNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            checked: !node.checked,
          };
        }
        if (node.children) {
          return {
            ...node,
            children: updateNode(node.children),
          };
        }
        return node;
      });
    };
    setLinkDirectoryTree(prev => updateNode(prev));
  };

  // DIRECTORY MODE: Toggle node checked state for analysis tree (分析组)
  const toggleAnalysisDirectoryNodeCheck = (nodeId: string) => {
    // Clear link tree (mutual exclusivity)
    const clearTree = (nodes: DirectoryNode[]): DirectoryNode[] => {
      return nodes.map(n => ({
        ...n,
        checked: false,
        children: n.children ? clearTree(n.children) : undefined,
      }));
    };
    setLinkDirectoryTree(prev => clearTree(prev));

    const updateNode = (nodes: DirectoryNode[]): DirectoryNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            checked: !node.checked,
          };
        }
        if (node.children) {
          return {
            ...node,
            children: updateNode(node.children),
          };
        }
        return node;
      });
    };
    setAnalysisDirectoryTree(prev => updateNode(prev));
  };

  // DIRECTORY MODE: Toggle folder expand/collapse
  const toggleDirectoryNodeExpand = (
    nodeId: string,
    isLinkTree: boolean,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    const updateNode = (nodes: DirectoryNode[]): DirectoryNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, expanded: !node.expanded };
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };

    if (isLinkTree) {
      setLinkDirectoryTree(prev => updateNode(prev));
    } else {
      setAnalysisDirectoryTree(prev => updateNode(prev));
    }
  };

  // Clear all selections
  const clearAllSelections = () => {
    if (viewMode === 'classic') {
      setGroups(prev =>
        prev.map(g => ({
          ...g,
          items: g.items.map(i => ({ ...i, checked: false })),
        }))
      );
    } else {
      const clearNodes = (nodes: DirectoryNode[]): DirectoryNode[] => {
        return nodes.map(n => ({
          ...n,
          checked: false,
          children: n.children ? clearNodes(n.children) : undefined,
        }));
      };
      setLinkDirectoryTree(prev => clearNodes(prev));
      setAnalysisDirectoryTree(prev => clearNodes(prev));
    }
  };

  // Uncheck a specific item by id
  const uncheckItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMode === 'classic') {
      setGroups(prev =>
        prev.map(g => ({
          ...g,
          items: g.items.map(item =>
            item.id === itemId ? { ...item, checked: false } : item
          ),
        }))
      );
    } else {
      const uncheckNodes = (nodes: DirectoryNode[]): DirectoryNode[] => {
        return nodes.map(n => ({
          ...n,
          checked: n.id === itemId ? false : n.checked,
          children: n.children ? uncheckNodes(n.children) : undefined,
        }));
      };
      setLinkDirectoryTree(prev => uncheckNodes(prev));
      setAnalysisDirectoryTree(prev => uncheckNodes(prev));
    }
  };

  const removeHistoryItem = (id: string) => {
    setHistoryList(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistoryList([]);
  };

  // Check stats for Directory categories
  const linkLeaves = getDirectoryLeaves(linkDirectoryTree);
  const linkCheckedCount = linkLeaves.filter(i => i.checked).length;
  const isLinkAllChecked = linkLeaves.length > 0 && linkCheckedCount === linkLeaves.length;
  const isLinkIndeterminate = linkCheckedCount > 0 && !isLinkAllChecked;

  const analysisLeaves = getDirectoryLeaves(analysisDirectoryTree);
  const analysisCheckedCount = analysisLeaves.filter(i => i.checked).length;
  const isAnalysisAllChecked = analysisLeaves.length > 0 && analysisCheckedCount === analysisLeaves.length;
  const isAnalysisIndeterminate = analysisCheckedCount > 0 && !isAnalysisAllChecked;

  // Render tree node recursively for Directory Mode
  const renderDirectoryNodes = (
    nodes: DirectoryNode[],
    isLinkTree: boolean,
    level = 0
  ): React.ReactNode => {
    return nodes.map(node => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = node.expanded ?? false;

      // Filter logic
      if (
        filterMode === 'selected' &&
        !node.checked &&
        (!node.children || !node.children.some(c => c.checked))
      ) {
        return null;
      }
      if (filterMode === 'unselected' && node.checked && !hasChildren) {
        return null;
      }

      const isInterfaceHighlight = node.id === 'link-node-if1';
      const isHs2Highlight = node.id === 'node-hs2';
      const isHighlighted =
        (node.checked && !node.isFolder) || isInterfaceHighlight || isHs2Highlight;

      return (
        <div key={node.id} className="flex flex-col">
          {/* Node Row */}
          <div
            onClick={() => {
              if (hasChildren && node.isFolder && node.iconType !== 'interface') {
                toggleDirectoryNodeExpand(node.id, isLinkTree);
              } else {
                if (isLinkTree) {
                  toggleLinkDirectoryNodeCheck(node.id);
                } else {
                  toggleAnalysisDirectoryNodeCheck(node.id);
                }
              }
            }}
            className={`group flex items-center justify-between py-1.5 px-2 hover:bg-[#f0f7ff] cursor-pointer text-xs select-none relative transition-colors ${
              isHighlighted
                ? 'bg-[#e6f7ff] border-r-[3px] border-[#0080ff]'
                : ''
            }`}
            style={{ paddingLeft: `${Math.max(12, level * 16 + 12)}px` }}
          >
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              {/* Expand/Collapse box icon [-] or [+] */}
              {hasChildren ? (
                <button
                  onClick={(e) => toggleDirectoryNodeExpand(node.id, isLinkTree, e)}
                  className="w-3.5 h-3.5 rounded-xs border border-[#1890ff] bg-white flex items-center justify-center text-[#1890ff] shrink-0 hover:bg-blue-50 transition-colors"
                >
                  {isExpanded ? (
                    <Minus className="w-2.5 h-2.5 stroke-[2.5]" />
                  ) : (
                    <span className="text-[11px] font-bold leading-none">+</span>
                  )}
                </button>
              ) : (
                <div className="w-3.5 shrink-0" />
              )}

              {/* Node Icon */}
              {node.isFolder && !node.iconType && (
                <Folder className="w-4 h-4 text-[#78889b] fill-[#78889b]/30 shrink-0" />
              )}
              {node.iconType === 'datacenter' && (
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-[#1890ff] shrink-0 fill-current">
                  <rect x="2" y="2.5" width="12" height="3" rx="0.5" />
                  <rect x="2" y="6.5" width="12" height="3" rx="0.5" />
                  <rect x="2" y="10.5" width="12" height="3" rx="0.5" />
                </svg>
              )}
              {node.iconType === 'interface' && (
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-[#1890ff] shrink-0 fill-current">
                  <path d="M11.5 2.5a1.4 1.4 0 00-2 0L7.8 4.2l-1-.3a2 2 0 00-2.2.4L3.7 5.2a.5.5 0 00.1.8l1.3.8-2.6 2.6a1 1 0 000 1.4l.6.6a1 1 0 001.4 0l2.6-2.6.8 1.3a.5.5 0 00.8.1l.9-.9a2 2 0 00.4-2.2l-.3-1 1.7-1.7a1.4 1.4 0 000-2z" />
                </svg>
              )}
              {node.iconType === 'site' && (
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-[#1890ff] shrink-0 fill-current">
                  <path d="M7 1h2v3H7V1zm-4 7h10v2H3V8zm-1 4h3v3H2v-3zm9 0h3v3h-3v-3zm-4-4h2v3H7V8z" />
                </svg>
              )}
              {node.iconType === 'fork' && (
                <GitFork className="w-3.5 h-3.5 text-[#1890ff] shrink-0" />
              )}

              {/* Node Name */}
              <span
                className={`truncate ${
                  node.checked ? 'text-gray-900 font-medium' : 'text-gray-700'
                }`}
              >
                {node.name}
              </span>
            </div>

            {/* Checkbox for selectable items (multi-selection) */}
            {(node.iconType === 'interface' ||
              node.iconType === 'vlan' ||
              node.iconType === 'fork' ||
              node.iconType === 'site' ||
              (!node.isFolder && !node.children)) && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (isLinkTree) {
                    toggleLinkDirectoryNodeCheck(node.id);
                  } else {
                    toggleAnalysisDirectoryNodeCheck(node.id);
                  }
                }}
                className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center transition-colors border shrink-0 mr-1.5 ${
                  node.checked
                    ? 'bg-[#1890ff] border-[#1890ff] text-white'
                    : 'bg-white border-gray-300 group-hover:border-blue-400'
                }`}
              >
                {node.checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            )}
          </div>

          {/* Children */}
          {hasChildren && isExpanded && (
            <div className="flex flex-col">
              {renderDirectoryNodes(node.children!, isLinkTree, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-gray-800 antialiased select-none font-sans">
      {/* LEFT SIDEBAR */}
      <aside className="w-[58px] shrink-0 bg-[#1e222d] flex flex-col justify-between z-20 select-none">
        <div>
          <div className="h-[44px] flex items-center justify-center border-b border-[#2a2f3d]">
            <span className="text-white font-bold text-sm tracking-wide">NGPM</span>
          </div>

          <nav className="flex flex-col py-1">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  title={item.label}
                  className={`w-full py-2.5 flex flex-col items-center justify-center transition-colors relative group ${
                    isActive
                      ? 'bg-[#0070f3] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-[#282d3c]'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
                  <span className={`text-[11px] mt-1 tracking-tight leading-none ${isActive ? 'text-white font-medium' : 'text-gray-400 group-hover:text-white'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="py-3 flex justify-center border-t border-[#2a2f3d]">
          <button className="text-gray-400 hover:text-white transition-colors" title="收起导航">
            <PanelLeftClose className="w-[17px] h-[17px]" />
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* TOP HEADER */}
        <header className="h-[44px] bg-[#1e222d] shrink-0 flex items-center justify-between px-4 border-b border-[#282e3d]">
          <div className="flex items-center"></div>

          <div className="flex items-center space-x-4 text-gray-300">
            <button className="text-gray-300 hover:text-white transition-colors p-1" title="搜索">
              <Search className="w-4 h-4" strokeWidth={1.9} />
            </button>
            <button className="text-gray-300 hover:text-white transition-colors p-1" title="全屏">
              <Maximize2 className="w-4 h-4" strokeWidth={1.9} />
            </button>
            
            <div className="flex items-center space-x-2 pl-2 cursor-pointer hover:opacity-90 transition-opacity">
              <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-gray-300 bg-[#282d3c]">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs text-gray-200">admin</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        </header>

        {/* SUBHEADER: Page Title & Time Range Filter */}
        <div className="h-[44px] bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-[4px] bg-[#1890ff] flex items-center justify-center text-white shadow-xs">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <h1 className="text-[15px] font-semibold text-gray-800 leading-none">全局搜索</h1>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center h-[28px] border border-gray-300 rounded-sm px-2.5 bg-white text-xs text-gray-600 space-x-2 hover:border-gray-400 transition-colors">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-sans text-[12px]">{timeRange}</span>
            </div>

            <button
              className="h-[28px] w-[28px] bg-[#1890ff] hover:bg-[#40a9ff] text-white rounded-sm flex items-center justify-center transition-colors shadow-2xs"
              title="按时间范围查询"
            >
              <Search className="w-3.5 h-3.5" strokeWidth={2.2} />
            </button>

            <button
              className="h-[28px] w-[28px] border border-gray-300 hover:border-[#1890ff] hover:text-[#1890ff] text-gray-600 rounded-sm flex items-center justify-center transition-colors"
              title="刷新"
            >
              <RotateCw className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS ROW */}
        <div className="bg-white border-b border-gray-200 px-4 flex items-center gap-6 shrink-0 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 flex items-center space-x-1.5 text-xs font-normal whitespace-nowrap transition-colors relative border-b-2 ${
                  isActive
                    ? 'border-[#1890ff] text-[#1890ff] font-medium'
                    : 'border-transparent text-gray-600 hover:text-[#1890ff]'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-[#1890ff]' : 'text-blue-500/80'
                  }`}
                  strokeWidth={1.8}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* SEARCH INPUT BAR WITH DROPDOWN TRIGGER */}
        <div className="bg-white px-4 py-2.5 flex items-center gap-2.5 shrink-0 relative z-30">
          {/* Target Object Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            {/* Dropdown Trigger Box */}
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`h-[32px] min-w-[170px] max-w-[220px] rounded-sm px-2 flex items-center justify-between text-xs bg-white cursor-pointer select-none transition-all ${
                isDropdownOpen
                  ? 'border border-[#1890ff] shadow-[0_0_0_2px_rgba(24,144,255,0.2)]'
                  : 'border border-gray-300 hover:border-gray-400'
              }`}
            >
              {firstSelected ? (
                <div className="flex items-center space-x-1.5 min-w-0 flex-1">
                  <span className="inline-flex items-center bg-[#f0f5ff] text-[#1890ff] border border-[#d6e4ff] px-1.5 py-0.5 rounded text-[11px] max-w-[110px] truncate leading-none">
                    <span className="truncate">{firstSelected.name.split(' / ')[0]} / ...</span>
                    <X
                      className="w-2.5 h-2.5 ml-1 shrink-0 text-[#1890ff] hover:text-blue-700"
                      onClick={(e) => uncheckItem(firstSelected.id, e)}
                    />
                  </span>

                  {additionalCount > 0 && (
                    <span className="bg-[#f0f5ff] text-[#1890ff] border border-[#d6e4ff] text-[11px] px-1 py-0.5 rounded leading-none shrink-0 font-medium">
                      + {additionalCount}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-gray-400 text-xs truncate">请选择链路或分析组</span>
              )}

              <div className="ml-1 text-gray-400 shrink-0">
                {isDropdownOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                )}
              </div>
            </div>

            {/* POPUP DROPDOWN MENU */}
            {isDropdownOpen && (
              <div className="absolute top-[38px] left-0 w-[350px] bg-white rounded-xs shadow-[0_4px_16px_rgba(0,0,0,0.15)] border border-gray-200 z-50 flex flex-col max-h-[520px]">
                {/* Pointer Caret on top */}
                <div className="absolute -top-[5px] left-6 w-2.5 h-2.5 bg-[#f0f2f5] border-t border-l border-gray-200 rotate-45 z-10"></div>

                {/* Top Action Toolbar */}
                <div className="h-[36px] bg-[#f0f2f5] border-b border-gray-200 px-3 flex items-center justify-between text-xs text-gray-600 rounded-t-xs shrink-0 select-none relative">
                  <div className="flex items-center space-x-3">
                    {/* Selected Filter */}
                    <button
                      onClick={() => setFilterMode(filterMode === 'selected' ? 'all' : 'selected')}
                      className={`flex items-center space-x-1 hover:text-[#1890ff] transition-colors ${
                        filterMode === 'selected' ? 'text-[#1890ff] font-medium' : ''
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>已选</span>
                    </button>

                    <span className="text-gray-300">|</span>

                    {/* Unselected Filter */}
                    <button
                      onClick={() => setFilterMode(filterMode === 'unselected' ? 'all' : 'unselected')}
                      className={`flex items-center space-x-1 hover:text-[#1890ff] transition-colors ${
                        filterMode === 'unselected' ? 'text-[#1890ff] font-medium' : ''
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>未选</span>
                    </button>

                    <span className="text-gray-300">|</span>

                    {/* Clear Selections */}
                    <button
                      onClick={clearAllSelections}
                      className="flex items-center space-x-1 hover:text-red-500 transition-colors text-gray-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>清除</span>
                    </button>
                  </div>

                  {/* Configuration Button in Toolbar: Strictly 经典模式 & 目录模式 两种选择 */}
                  <div className="relative" ref={configMenuRef}>
                    <button
                      onClick={() => setIsConfigMenuOpen(!isConfigMenuOpen)}
                      className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                        isConfigMenuOpen
                          ? 'bg-blue-100 text-[#1890ff]'
                          : 'text-gray-500 hover:text-[#1890ff] hover:bg-gray-200/60'
                      }`}
                      title="配置模式"
                    >
                      <Settings className="w-3 h-3" />
                      <span>配置</span>
                      <ChevronDown className="w-2.5 h-2.5 opacity-70" />
                    </button>

                    {/* Mode Selection Popover: 只有经典模式与目录模式两种选择 */}
                    {isConfigMenuOpen && (
                      <div className="absolute right-0 top-[28px] w-[130px] bg-white rounded shadow-lg border border-gray-200 py-1 z-60 text-xs">
                        <button
                          onClick={() => {
                            setViewMode('classic');
                            setIsConfigMenuOpen(false);
                          }}
                          className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-blue-50 transition-colors ${
                            viewMode === 'classic' ? 'text-[#1890ff] font-medium bg-[#f0f7ff]' : 'text-gray-700'
                          }`}
                        >
                          <span>经典模式</span>
                          {viewMode === 'classic' && <Check className="w-3 h-3 text-[#1890ff]" />}
                        </button>

                        <button
                          onClick={() => {
                            setViewMode('directory');
                            setIsConfigMenuOpen(false);
                          }}
                          className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-blue-50 transition-colors ${
                            viewMode === 'directory' ? 'text-[#1890ff] font-medium bg-[#f0f7ff]' : 'text-gray-700'
                          }`}
                        >
                          <span>目录模式</span>
                          {viewMode === 'directory' && <Check className="w-3 h-3 text-[#1890ff]" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* MODE 1: CLASSIC MODE (经典模式: 接口 / Vlan虚链路 / 分析组 互斥) */}
                {viewMode === 'classic' && (
                  <div className="overflow-y-auto max-h-[440px] py-0.5 text-xs divide-y divide-gray-100">
                    {groups.map((group) => {
                      const visibleItems = group.items.filter((item) => {
                        if (filterMode === 'selected') return item.checked;
                        if (filterMode === 'unselected') return !item.checked;
                        return true;
                      });

                      if (visibleItems.length === 0 && filterMode !== 'all') {
                        return null;
                      }

                      const checkedCount = group.items.filter(i => i.checked).length;
                      const isAllChecked = group.items.length > 0 && checkedCount === group.items.length;
                      const isIndeterminate = checkedCount > 0 && !isAllChecked;
                      const isExpanded = expandedGroups[group.id] ?? false;

                      return (
                        <div key={group.id} className="py-0.5">
                          {/* Group Header Row */}
                          <div
                            onClick={() => toggleGroupExpand(group.id)}
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer select-none group"
                          >
                            <div className="flex items-center space-x-2.5 flex-1">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleGroup(group.id);
                                }}
                                className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center transition-colors border ${
                                  isAllChecked || isIndeterminate
                                    ? 'bg-[#1890ff] border-[#1890ff] text-white'
                                    : 'bg-white border-gray-300 hover:border-blue-400'
                                }`}
                              >
                                {isAllChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                {isIndeterminate && <Minus className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>

                              <span className="font-normal text-gray-800 text-[12px]">
                                {group.name} ({group.items.length}条)
                              </span>
                            </div>

                            {/* Chevron Arrow */}
                            <div className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors">
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                              )}
                            </div>
                          </div>

                          {/* Group Child Items */}
                          {isExpanded && (
                            <div className="flex flex-col bg-white">
                              {visibleItems.map((item) => {
                                return (
                                  <div
                                    key={item.id}
                                    onClick={() => toggleItem(group.id, item.id)}
                                    className={`flex items-center space-x-2.5 px-3 pl-8 py-1.5 hover:bg-[#f5f7fa] cursor-pointer text-xs transition-colors ${
                                      item.checked ? 'text-gray-800' : 'text-gray-400'
                                    }`}
                                  >
                                    <div
                                      className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center transition-colors border shrink-0 ${
                                        item.checked
                                          ? 'bg-[#1890ff] border-[#1890ff] text-white'
                                          : 'bg-white border-gray-300'
                                      }`}
                                    >
                                      {item.checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                    </div>

                                    {item.type === 'interface' && (
                                      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-[#1890ff] shrink-0 fill-current">
                                        <path d="M11.5 2.5a1.4 1.4 0 00-2 0L7.8 4.2l-1-.3a2 2 0 00-2.2.4L3.7 5.2a.5.5 0 00.1.8l1.3.8-2.6 2.6a1 1 0 000 1.4l.6.6a1 1 0 001.4 0l2.6-2.6.8 1.3a.5.5 0 00.8.1l.9-.9a2 2 0 00.4-2.2l-.3-1 1.7-1.7a1.4 1.4 0 000-2z" />
                                      </svg>
                                    )}
                                    {item.type === 'vlan' && (
                                      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-[#1890ff] shrink-0 fill-current">
                                        <path d="M2.5 3.5h2l2.5 6.5 2.5-6.5h2L8.5 12.5H6.5L2.5 3.5z" />
                                        <circle cx="12" cy="11.5" r="1.5" />
                                      </svg>
                                    )}
                                    {item.type === 'analysis_group' && (
                                      <GitFork className="w-3.5 h-3.5 text-[#1890ff] shrink-0" />
                                    )}

                                    <span className="truncate leading-normal select-none">
                                      {item.name}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* MODE 2: DIRECTORY MODE (目录模式: tab选择为链路与分析组，交互使用图1交互样式) */}
                {viewMode === 'directory' && (
                  <div className="overflow-y-auto max-h-[460px] py-0.5 text-xs divide-y divide-gray-100">
                    {/* 分类 1: 链路 (图1 交互样式: Checkbox + 链路 (14条) + Chevron >) */}
                    <div className="py-0.5">
                      <div
                        onClick={() => toggleDirectoryGroupExpand('link')}
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer select-none group"
                      >
                        <div className="flex items-center space-x-2.5 flex-1">
                          {/* Checkbox */}
                          <div
                            onClick={(e) => toggleDirectoryCategoryCheck('link', e)}
                            className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center transition-colors border ${
                              isLinkAllChecked || isLinkIndeterminate
                                ? 'bg-[#1890ff] border-[#1890ff] text-white'
                                : 'bg-white border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {isLinkAllChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            {isLinkIndeterminate && <Minus className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>

                          <span className="font-normal text-gray-800 text-[12px]">
                            链路 ({linkLeaves.length}条)
                          </span>
                        </div>

                        {/* Chevron Arrow */}
                        <div className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors">
                          {expandedDirectoryGroups.link ? (
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* 链路 目录树展开内容 (图1链路目录) */}
                      {expandedDirectoryGroups.link && (
                        <div className="flex flex-col bg-white border-t border-gray-50">
                          {renderDirectoryNodes(linkDirectoryTree, true)}
                        </div>
                      )}
                    </div>

                    {/* 分类 2: 分析组 (图1 交互样式: Checkbox + 分析组 (15条) + Chevron >) */}
                    <div className="py-0.5">
                      <div
                        onClick={() => toggleDirectoryGroupExpand('analysis')}
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer select-none group"
                      >
                        <div className="flex items-center space-x-2.5 flex-1">
                          {/* Checkbox */}
                          <div
                            onClick={(e) => toggleDirectoryCategoryCheck('analysis', e)}
                            className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center transition-colors border ${
                              isAnalysisAllChecked || isAnalysisIndeterminate
                                ? 'bg-[#1890ff] border-[#1890ff] text-white'
                                : 'bg-white border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {isAnalysisAllChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            {isAnalysisIndeterminate && <Minus className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>

                          <span className="font-normal text-gray-800 text-[12px]">
                            分析组 ({analysisLeaves.length}条)
                          </span>
                        </div>

                        {/* Chevron Arrow */}
                        <div className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors">
                          {expandedDirectoryGroups.analysis ? (
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* 分析组 目录树展开内容 */}
                      {expandedDirectoryGroups.analysis && (
                        <div className="flex flex-col bg-white border-t border-gray-50">
                          {renderDirectoryNodes(analysisDirectoryTree, false)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search Input Box */}
          <div className="flex-1 h-[32px] border border-gray-300 rounded-sm px-3 flex items-center bg-white focus-within:border-[#1890ff] transition-colors">
            <Search className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder='按IP进行搜索 支持离散IP、IP段及IP/子网掩码，离散IP用","隔开，IP段用"-"连接。'
              className="w-full text-xs text-gray-700 placeholder:text-gray-400 placeholder:text-[12px] bg-transparent outline-none"
            />
          </div>

          {/* Search Action Button */}
          <button className="h-[32px] px-5 bg-[#1890ff] hover:bg-[#40a9ff] text-white text-xs font-normal rounded-sm transition-colors shrink-0 shadow-2xs">
            开始搜索
          </button>
        </div>

        {/* SEARCH HISTORY CHIPS ROW */}
        <div className="bg-white px-4 pb-2.5 flex items-center justify-between text-xs shrink-0 border-b border-gray-100">
          <div className="flex items-center flex-wrap gap-2 overflow-x-auto py-1 scrollbar-none">
            <div className="flex items-center text-gray-500 text-[12px] mr-1 shrink-0">
              <Target className="w-3.5 h-3.5 mr-1 text-gray-400" strokeWidth={1.8} />
              <span>历史搜索</span>
            </div>

            {historyList.map((item) => (
              <div
                key={item.id}
                className="inline-flex items-center bg-[#f2f4f8] hover:bg-[#e9edf3] text-gray-700 text-[11px] px-2 py-0.5 rounded-sm border border-gray-200 transition-colors whitespace-nowrap group"
              >
                <span>{item.label}</span>
                {item.arrow && (
                  <ArrowRight className="w-3 h-3 mx-1 text-gray-400 shrink-0" strokeWidth={2} />
                )}
                {item.target && <span>{item.target}</span>}
                <button
                  onClick={() => removeHistoryItem(item.id)}
                  className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>

          {historyList.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center text-gray-400 hover:text-gray-600 text-[11px] whitespace-nowrap ml-3 transition-colors shrink-0"
              title="清除历史搜索记录"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              <span>清除记录</span>
            </button>
          )}
        </div>

        {/* MAIN BODY: 3-Step Guide Diagram */}
        <div className="flex-1 bg-white flex flex-col items-center justify-center relative p-6">
          <div className="flex flex-col items-center max-w-[850px] w-full -mt-16">
            <div className="flex items-center justify-center gap-8 w-full mb-6">
              {/* Step 1 Graphic Card */}
              <div className="w-[146px] h-[98px] bg-[#f0f6ff] border border-[#d6e7ff] rounded-xl flex items-center justify-center gap-3.5 shadow-2xs">
                <div className="w-[42px] h-[58px] bg-white rounded-lg shadow-2xs border border-blue-100 flex flex-col items-center justify-between py-2">
                  <div className="w-6 h-6 rounded-[5px] bg-[#1890ff] flex items-center justify-center text-white">
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-3.5 h-3.5 rounded-xs bg-[#1890ff] flex items-center justify-center text-white text-[9px]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>

                <div className="w-[42px] h-[58px] bg-white rounded-lg shadow-2xs border border-blue-100 flex flex-col items-center justify-between py-2">
                  <div className="w-6 h-6 rounded-[5px] bg-[#1890ff] flex items-center justify-center text-white">
                    <GitFork className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-3.5 h-3.5 rounded-xs bg-[#1890ff] flex items-center justify-center text-white text-[9px]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>
              </div>

              <div className="text-[#69c0ff] flex items-center">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M5 3l14 9-14 9V3z" />
                </svg>
              </div>

              {/* Step 2 Graphic Card */}
              <div className="w-[146px] h-[98px] bg-[#f0f6ff] border border-[#d6e7ff] rounded-xl flex flex-col items-center justify-center p-3 shadow-2xs">
                <div className="w-full bg-white rounded-lg p-2 shadow-2xs border border-blue-100 flex flex-col space-y-2">
                  <div className="w-12 h-1.5 bg-blue-200 rounded-full"></div>
                  <div className="h-[22px] border border-blue-200 rounded flex items-center justify-between px-1.5 bg-[#fbfdff]">
                    <span className="text-[9px] text-gray-500 font-mono">172.11.11.xxx</span>
                    <div className="w-3.5 h-3.5 rounded-[2px] bg-[#1890ff] flex items-center justify-center text-white">
                      <Search className="w-2 h-2 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[#69c0ff] flex items-center">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M5 3l14 9-14 9V3z" />
                </svg>
              </div>

              {/* Step 3 Graphic Card */}
              <div className="w-[146px] h-[98px] bg-[#f0f6ff] border border-[#d6e7ff] rounded-xl flex flex-col items-center justify-center p-3 shadow-2xs">
                <div className="w-full bg-white rounded-lg p-2.5 shadow-2xs border border-blue-100 flex flex-col space-y-1.5">
                  <div className="w-full h-1.5 bg-blue-200/70 rounded-full mb-0.5"></div>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center space-x-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1890ff] shrink-0"></div>
                      <div className="h-1 bg-blue-100 rounded-full flex-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 w-full text-xs text-gray-600">
              <div className="w-[146px] flex items-center justify-center space-x-1.5">
                <span className="w-4 h-4 rounded-full bg-[#1890ff] text-white flex items-center justify-center text-[10px] font-medium shrink-0">
                  1
                </span>
                <span className="text-[12px] whitespace-nowrap">选择链路或分析组</span>
              </div>

              <div className="w-5 shrink-0 opacity-0"></div>

              <div className="w-[146px] flex items-center justify-center space-x-1.5">
                <span className="w-4 h-4 rounded-full bg-[#1890ff] text-white flex items-center justify-center text-[10px] font-medium shrink-0">
                  2
                </span>
                <span className="text-[12px] whitespace-nowrap">在输入框输入查询条件</span>
              </div>

              <div className="w-5 shrink-0 opacity-0"></div>

              <div className="w-[146px] flex items-center justify-center space-x-1.5">
                <span className="w-4 h-4 rounded-full bg-[#1890ff] text-white flex items-center justify-center text-[10px] font-medium shrink-0">
                  3
                </span>
                <span className="text-[12px] whitespace-nowrap">全局搜索数据结果</span>
              </div>
            </div>
          </div>

          {/* FLOATING BOT ASSISTANT (BOTTOM RIGHT) */}
          <div className="fixed bottom-6 right-7 cursor-pointer group z-20">
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-b from-[#e6f7ff] to-[#bae7ff] p-1 shadow-[0_6px_20px_rgba(24,144,255,0.28)] ring-2 ring-[#91d5ff] transition-transform group-hover:scale-105 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative shadow-inner">
                <svg viewBox="0 0 48 48" className="w-10 h-10">
                  <defs>
                    <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#434343" />
                      <stop offset="100%" stopColor="#1f1f1f" />
                    </linearGradient>
                    <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#d9e8fb" />
                    </linearGradient>
                    <linearGradient id="earGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#69c0ff" />
                      <stop offset="100%" stopColor="#1890ff" />
                    </linearGradient>
                  </defs>

                  <rect x="22.5" y="6" width="3" height="4" rx="1.5" fill="#8c8c8c" />
                  <circle cx="24" cy="5" r="2.5" fill="#40a9ff" />

                  <rect x="5" y="19" width="5" height="12" rx="2.5" fill="url(#earGrad)" />
                  <rect x="38" y="19" width="5" height="12" rx="2.5" fill="url(#earGrad)" />

                  <rect x="8" y="10" width="32" height="28" rx="14" fill="url(#headGrad)" />

                  <rect x="11" y="16" width="26" height="16" rx="8" fill="url(#visorGrad)" />

                  <ellipse cx="19" cy="24" rx="2.5" ry="3" fill="#1890ff" />
                  <ellipse cx="29" cy="24" rx="2.5" ry="3" fill="#1890ff" />
                  <ellipse cx="20" cy="23" rx="0.8" ry="1" fill="#ffffff" />
                  <ellipse cx="30" cy="23" rx="0.8" ry="1" fill="#ffffff" />

                  <path d="M 22 28 Q 24 30 26 28" stroke="#1890ff" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
