exports.activate = function() {
  tabs = []
  nova.workspace.onDidAddTextEditor((editor) => trackEditor(editor))
}

exports.deactivate = function() {
  tabs = []
}

nova.commands.register("go-to-tab.show-tabs", (workspace) => {
  removeClosedTabs()
  workspace.showChoicePalette(editorPaths(), {}, (name, index) => openEditor(index));
});

// // //

function editorPaths() {
  return tabs.map((editor) => tabTitle(editor))
}

function isOpen(editor) {
  return editor && editor.document && !editor.document.isClosed
}

function isTracked(editor) {
  return tabs.indexOf(editor) !== -1;
}

function openEditor(index) {
  if (index) {
    const editor = tabs[index]
    nova.workspace.openFile(editor.document.path)
    trackEditor(editor)
  }
}

function removeClosedTabs() {
  tabs = tabs.filter(editor => isOpen(editor))
}

function tabTitle(editor) {
  if (editor.document.isUntitled) {
    return "Untitled"
  } else {
    return nova.workspace.relativizePath(editor.document.path)
  }
}

function trackEditor(newEditor) {
  if (!isTracked(newEditor)) {
    let index = 0;
    while (index < tabs.length && tabTitle(tabs[index]) < tabTitle(newEditor)) {
      index++;
    }

    tabs.splice(index, 0, newEditor);
  }
}
