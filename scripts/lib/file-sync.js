/**
 * 文件同步模块
 * 负责将源目录的文档同步到 VitePress docs 目录
 */

const fs = require('fs');
const path = require('path');
const { isExcluded } = require('./file-utils');

/**
 * 同步项目文档到 VitePress docs 目录
 * @param {Object} project - 项目配置
 * @param {string} docsBaseDir - docs 基础目录
 * @param {Array} excludeList - 排除列表
 * @param {string} rootDir - 项目根目录
 */
function syncProjectDocuments(project, docsBaseDir, excludeList, rootDir) {
    const targetDir = path.join(rootDir, docsBaseDir, project.name);

    cleanTargetDirectory(targetDir);
    copyDirectory(project.sourceDir, targetDir, excludeList);
}

/**
 * 清理目标目录（删除所有 .md 文件，保留目录结构由 copyDirectory 重建）
 * @param {string} dir - 目标目录
 */
function cleanTargetDirectory(dir) {
    if (!fs.existsSync(dir)) {
        return;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            cleanTargetDirectory(fullPath);
            // 如果目录为空则删除
            if (fs.readdirSync(fullPath).length === 0) {
                fs.rmdirSync(fullPath);
            }
        } else if (entry.name.endsWith('.md')) {
            fs.unlinkSync(fullPath);
        }
    }
}

/**
 * 为空项目生成占位页面
 * @param {Object} project - 项目配置
 * @param {string} docsBaseDir - docs 基础目录
 * @param {string} rootDir - 项目根目录
 */
function generateEmptyProjectPage(project, docsBaseDir, rootDir) {
    const targetDir = path.join(rootDir, docsBaseDir, project.name);
    const indexFile = path.join(targetDir, 'index.md');

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    const content = `# ${project.name}

> 该项目暂无文档

## 源目录

\`${project.sourceDir}\`

${project.description ? `## 描述\n\n${project.description}` : ''}

---

*此页面由系统自动生成，当源目录中添加 \`.md\` 文件后将自动更新。*
`;

    fs.writeFileSync(indexFile, content, 'utf-8');
}

/**
 * 递归复制目录（只复制包含 .md 文件的目录）
 * @param {string} src - 源目录
 * @param {string} dest - 目标目录
 * @param {Array} excludeList - 排除列表
 * @returns {boolean} - 是否复制了文件
 */
function copyDirectory(src, dest, excludeList) {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    let hasCopiedFiles = false;

    for (const entry of entries) {
        if (isExcluded(entry.name, excludeList)) {
            continue;
        }

        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            if (copyDirectory(srcPath, destPath, excludeList)) {
                hasCopiedFiles = true;
            }
        } else if (entry.name.endsWith('.md')) {
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
            }
            fs.copyFileSync(srcPath, destPath);
            hasCopiedFiles = true;
        }
    }

    return hasCopiedFiles;
}

module.exports = {
    syncProjectDocuments,
    cleanTargetDirectory,
    generateEmptyProjectPage,
    copyDirectory
};
