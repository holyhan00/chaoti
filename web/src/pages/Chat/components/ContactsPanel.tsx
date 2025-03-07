//联系人面板////src/pages/Chat/components/ContactsPanel.tsx
import { useState, useEffect, useRef } from "react";
import {
    Box,
    List,
    ListItemButton,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import ContactsHeader from "./ContactsHeader";
import AssistantDialog from "./AssistantDialog";
import { useChatContext } from "../../../contexts/ChatContext";
import styled from "styled-components";
import Settings from "../../Settings";
import { AppleDialog, CustomTextField } from "../../../components/AppleDialog";

// 定义右键菜单的样式
const RightAlignedMenu = styled(Menu)`
  .MuiPaper-root {
    position: absolute;
    bottom: 90;
    width: 100px;
    font-size: 10px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 4px 0;
    max-height: none;
    overflow-y: hidden;
    background-color: #EDEDED;
  }
`;

// 定义菜单选项的样式，调整字体大小
const CustomMenuItem = styled(MenuItem)`
  padding: 6px 12px;
  min-height: 32px;
  display: flex;
  align-items: center;
  font-size: 14px;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const ContactsPanel = () => {
    const {
        assistants,
        currentAssistant,
        addAssistant,
        selectAssistant,
        updateAssistants,
        deleteAssistantAndConversations,
    } = useChatContext();

    const [renameOpen, setRenameOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedAssistant, setSelectedAssistant] = useState<any>(null);
    const [newName, setNewName] = useState("");
    const [searchText, setSearchText] = useState("");
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [selectedAssistantForSettings, setSelectedAssistantForSettings] = useState<any>(null);

    // 默认超级助手（不能删除）
    const defaultSuperAssistant = {
        id: "super",
        name: "超级助手",
        avatar: "/super - assistant.png",
        description: "全能助手，轻松搞定",
    };

    // 助手排序：置顶的排在超级助手下面，添加空值检查
    const sortedAssistants = assistants
      ? assistants.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
        : [];

    // 从 assistants 数组中获取最新的超级助手信息
    const latestSuperAssistant = assistants?.find(
        (assistant) => assistant.id === "super"
    ) || defaultSuperAssistant;

    // 从 sortedAssistants 中过滤掉超级助手
    const sortedAssistantsWithoutSuper = sortedAssistants.filter(assistant => assistant.id!== "super");

    // 搜索助手
    const filteredAssistants = [latestSuperAssistant, ...sortedAssistantsWithoutSuper].filter(
        (a) => a.name.toLowerCase().includes(searchText.toLowerCase())
    );

    // 右键菜单（出现在助手右下角）
    const handleContextMenu = (e: any, assistant: any) => {
        e.preventDefault();
        setSelectedAssistant(assistant);
        setMenuAnchor(e.currentTarget);
    };

    const handleCloseMenu = () => setMenuAnchor(null);

    // 修改备注
    const handleRename = () => {
        setNewName(selectedAssistant.name);
        setRenameOpen(true);
        handleCloseMenu();
    };

    // 修改 handleSaveRename 方法，确保顶部会话列表更新
    const handleSaveRename = () => {
        let updatedAssistants;
        if (selectedAssistant.id === "super") {
            // 如果是超级助手，更新超级助手的名称
            const updatedSuperAssistant = { ...selectedAssistant, name: newName };
            // 找到原超级助手在 assistants 数组中的索引
            const superAssistantIndex = assistants.findIndex(
                (assistant) => assistant.id === "super"
            );
            if (superAssistantIndex!== -1) {
                // 直接替换原超级助手
                updatedAssistants = [...assistants];
                updatedAssistants[superAssistantIndex] = updatedSuperAssistant;
            } else {
                // 如果原超级助手不存在，可能是逻辑错误，这里可以添加日志或错误处理
                updatedAssistants = assistants;
            }
        } else {
            updatedAssistants = assistants
              ? assistants.map((a) =>
                    a.id === selectedAssistant.id
                      ? { ...a, name: newName }
                        : a
                )
                : [];
        }
        updateAssistants(updatedAssistants);

        // 如果当前助手是被修改的助手，更新 currentAssistant
        if (currentAssistant?.id === selectedAssistant.id) {
            selectAssistant({ ...selectedAssistant, name: newName });
        }

        setRenameOpen(false);
    };

    // 置顶助手
    const handlePinAssistant = () => {
        if (selectedAssistant.id === "super") {
            // 超级助手不支持置顶
            return;
        }
        const updated = assistants
          ? assistants.map((a) =>
                a.id === selectedAssistant.id
                  ? { ...a, pinned: !a.pinned }
                    : a
            )
            : [];
        updateAssistants(updated);
        handleCloseMenu();
    };

    // 配置助手
    const handleConfigure = () => {
        setSelectedAssistantForSettings(selectedAssistant);
        setSettingsOpen(true);
        handleCloseMenu();
    };

    // 删除助手
    const handleDelete = () => {
        if (selectedAssistant.id === "super") {
            // 超级助手不能删除
            return;
        }
        setDeleteOpen(true);
        handleCloseMenu();
    };

    const confirmDelete = () => {
        if (assistants) {
            deleteAssistantAndConversations(assistants.indexOf(selectedAssistant));
        }
        setDeleteOpen(false);
    };

    // 添加助手
    const handleAddNewAssistant = (newAssistant: any) => {
        addAssistant({
            ...newAssistant,
            id: `assistant - ${Date.now()}`,
        });
        setAddOpen(false);
    };

    // 处理按键事件
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSaveRename();
        }
    };

    const renameInputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (renameOpen && renameInputRef.current) {
            renameInputRef.current.focus();
        }
    }, [renameOpen]);

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* 顶部搜索栏 & 添加助手 */}
            <ContactsHeader
                onSearch={setSearchText}
                onAddClick={() => setAddOpen(true)}
            />

            {/* 助手列表（包含超级助手） */}
            <List>
                {filteredAssistants.map((assistant) => (
                    <ListItemButton
                        key={assistant.id}
                        selected={assistant.id === currentAssistant?.id}
                        onClick={() => selectAssistant(assistant)}
                        onContextMenu={(e) => handleContextMenu(e, assistant)}
                    >
                        <ListItemAvatar>
                            <Avatar src={assistant.avatar} />
                        </ListItemAvatar>
                        <ListItemText primary={assistant.name} />
                    </ListItemButton>
                ))}
            </List>

            {/* 右键菜单 */}
            <RightAlignedMenu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                {selectedAssistant && (
                    <>
                        <CustomMenuItem onClick={handleRename}>备注</CustomMenuItem>
                        {/* 只在非超级助手时显示置顶选项 */}
                        {selectedAssistant.id!== "super" && (
                            <CustomMenuItem onClick={handlePinAssistant}>
                                {selectedAssistant.pinned ? "取消置顶" : "置顶"}
                            </CustomMenuItem>
                        )}
                        <CustomMenuItem onClick={handleConfigure}>配置</CustomMenuItem>
                        {selectedAssistant.id!== "super" && (
                            <CustomMenuItem onClick={handleDelete}>删除</CustomMenuItem>
                        )}
                    </>
                )}
            </RightAlignedMenu>

            {/* 添加助手弹窗 */}
            <AssistantDialog
                open={addOpen}
                onClose={() => setAddOpen(false)}
                onSelect={handleAddNewAssistant}
                currentAssistants={[]}
            />

            {/* 修改名称弹窗，使用通用对话框组件 */}
            <AppleDialog
                open={renameOpen}
                title="修改名称"
                content={
                    <CustomTextField
                        fullWidth
                        inputRef={renameInputRef}
                        autoFocus
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                }
                confirmText="保存"
                cancelText="取消"
                onClose={() => setRenameOpen(false)}
                onConfirm={handleSaveRename}
            />

            {/* 删除助手弹窗，使用通用对话框组件 */}
            <AppleDialog
                open={deleteOpen}
                title="删除助手"
                content={
                    <Typography>
                        你确定要删除 {selectedAssistant?.name} 吗？
                    </Typography>
                }
                confirmText="删除"
                cancelText="取消"
                onClose={() => setDeleteOpen(false)}
                onConfirm={confirmDelete}
                deleteDialog={true}
                textLetterSpacing="10px"
                textFontSize="1rem"
            />

            {/* Settings 弹窗 */}
            <Settings
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                assistant={selectedAssistantForSettings}
            />
        </Box>
    );
};

export default ContactsPanel;