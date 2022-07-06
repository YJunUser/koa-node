## hook学习之路

### useRafState

React state hook that only updates state in the callback of [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

适用于变化很多次的state

```typescript
export const useRafState<S> = (initialState: S | (() =>S)): [S, Dispatch<SetStateAction<S>>] => {
  const [state, setState] = useState(initialState);
	const frame = useRef(0);
	
	const setRafState = useCallback((value: S | (preState: S) => S) => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      setState(value)
    })
  }, [])
  
  useUmount(() => {
    cancelAnimationFrame(frame.current);
  })

	return [state, setRafState];
}
```

### useScroll

如何处理滚动，创建一个HTMLElement元素，并给这个元素添加scroll监听，为了防止数据变化太快，用useRafState做处理

```typescript

export const useScroll = (): [RefCallback<HTMLElement>, State, HTMLElement | null] => {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [state, setState] = useRafState<State>({x:0, y:0});
  
  // callback ref https://react.docschina.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down
  const ref = useCallback(() => {
    if (node !== null) {
      setNode(node);
    }
  }, []);
  
  useEffect(() => {
    const handler = () => {
      if (node) {
        setState({
          x: node.scrollLeft,
          y: node.scrollTop
        })
      }
    }
    
    if(node) {
      node.addEventListener('scroll', handler, {
        capture: false,
        passive: true
      })
    }
    
    return () => {
      if(node) {
        node.removeEventListener('scroll', handler, {
          capture: false
        })
      }
    }
  }, [node])
}
```

### useScrollBottom

滑到底后，如何优雅加载，进一步给node添加一些事件，当node滑倒底部后，就触发传入的onScrollBottom函数

```typescript
export const useScrollBottom = (buffer: number, onScrollBottom: () => void) => {
  const [ref, {y: scrollTop}, node] = useScroll();
  const fn = usePersistCallback(onScrollBottom);
  useEffect(() => {
    if (!node || scrollTOp === 0) {
      return;
    }
    
    if(node.clientHeight + scrollTop > node.scrollHeight - buffer) {
      fn();
    }
    
  }, [node, scrollTop])
  
  return ref;
}
```

### react-hook-form

[react-hook-form](https://react-hook-form.com/)是一个专门处理表单的hooks

