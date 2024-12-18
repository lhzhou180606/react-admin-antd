import type { ThemeConfig as AntdThemeConfig } from 'antd'
import { LayoutFlags, LayoutModes } from '../store/ConfigStore'

// 布局模式
export type LayoutMode = keyof typeof LayoutModes

// 主题风格
export type ThemeStyle = 'dynamic' | 'classic'

// 主题模式
export type ThemeMode = 'light' | 'dark' | 'system'

// 语言类型
export type Locale = 'zh-CN' | 'en-US';

// 布局标志类型
export type LayoutFlag = number

// 组件位置类型
export type ComponentPosition = 'IN_HEADER' | 'IN_SIDEBAR' | 'MIX' 
// export type ComponentPositionType = 'IN_HEADER' | 'IN_SIDEBAR'
// 布局配置接口
export interface LayoutConfig {
    mode: LayoutMode
    showTabs: boolean
    showLogo: boolean
    sidebarCollapsed: boolean
}

// 主题配置接口
export interface ThemeConfig extends AntdThemeConfig {
    style: ThemeStyle
    mode: ThemeMode
    colorPrimary: string
    borderRadius: number
}

// 添加预设主题色类型
export type PresetColor = {
  name: string;
  color: string;
  description?: string;
};

// ConfigStore 接口
export interface IConfigStore {
    // 状态
    themeStyle: ThemeStyle
    themeMode: ThemeMode
    showTabs: boolean
    sidebarCollapsed: boolean
    isDrawerMode: boolean
    drawerVisible: boolean
    settingDrawerVisible: boolean
    isActionsCollapsed: boolean
    searchVisible: boolean

    // 计算属性
    isDark: boolean
    currentLayoutMode: LayoutMode
    themeConfig: AntdThemeConfig
    showHeader: boolean
    showSidebar: boolean
    showHeaderLogo: boolean
    showSidebarLogo: boolean
    showHeaderMenu: boolean
    showSidebarMenu: boolean
    showHeaderUserActions: boolean
    showSidebarUserActions: boolean

    // 添加预设主题色相关属性
    presetColors: PresetColor[];
    currentPresetColor: string;

    // 方法
    setThemeMode(mode: ThemeMode): void
    setThemeStyle(style: ThemeStyle): void
    setLayoutMode(mode: LayoutMode): void
    toggleTabs(): void
    toggleVisible(type: 'setting' | 'sidebar', visible?: boolean): void
    toggleComponentPosition(component: keyof typeof LayoutFlags, position: 'IN_HEADER' | 'IN_SIDEBAR'): void
    toggleComponentShow(component: keyof typeof LayoutFlags, isShow: boolean): void
    getComponentPosition(component: keyof typeof LayoutFlags): ComponentPosition
    clearConfig(): void
    toggleActionsCollapsed(isShow: boolean): void
    toggleSearchVisible: (visible?: boolean) => void
    setPresetColor: (color: string) => void;
} 