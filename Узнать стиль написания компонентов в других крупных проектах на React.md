# takenote

[юнит тесты](https://github.com/taniarascia/takenote/tree/master/tests/unit/client/components)

Делят разные части компонента c помощью больших комментариев

```tsx
export const PreviewEditor: React.FC<PreviewEditorProps> = ({ noteText }) => {
  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()

  const _updateSelectedNotes = (noteId: string, multiSelect: boolean) =>
    dispatch(updateSelectedNotes({ noteId, multiSelect }))

  // ...
  
  const _swapFolder = (folder: Folder) => dispatch(swapFolder({ folder }))
  
  // ===========================================================================
  // Handlers
  // ===========================================================================

  const handleNoteLinkClick = (e: React.SyntheticEvent, note: NoteItem) => {
    e.preventDefault()

    if (note) {
      _updateActiveNote(note.id, false)
      _updateSelectedNotes(note.id, false)

      return _swapFolder(Folder.ALL)
    }
  }

  // ...

  return (
    <ReactMarkdown
      linkTarget="_blank"
      // ...
      className={`previewer previewer_direction-${directionText}`}
      source={noteText}
    />
  )
}
```

# tomato-work

глобальные константы:

```jsx
export const SETTING_SIDER_MENU_LIST = [
  {
    path: '/home/setting/base',
    name: '个人中心'
  },
  {
    path: '/home/setting/innerMessage',
    name: '消息中心'
  },
  {
    path: '/home/setting/notification',
    name: '消息通知'
  },
  // ...
]
```

Сначала объявление, затем эффекты:

```jsx
  const [messageList, setMessageList] = useState([])
  const [unReadCount, setUnReadCount] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { userInfo } = useAppSelector(state => state.user)

  useEffect(() => {
  // ...
  }
```


# react-trello-board

Структура файла:

1. Состояние
2. Эффекты
3. Обработчики

https://github.com/nmartinezb3/react-trello-board/blob/master/src/components/CardListHeader.jsx