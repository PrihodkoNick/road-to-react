Методы жизненного цикла

**1. constructor()**
- инициализация компонента

**2. static getDerivedStateFromProps()**
- вызывается перед render
- при начальном монтировании и при последующих обновлениях
- статический метод
- должен вернуть объект для обновления состояния или null

**3. shouldComponentUpdate(nextProps, nextState)**
- вызывается, когда меняется состояние или "пропсы"
- возвращает логическое значение
- может предотвратить отрисовку элемента

**5. render()**
- обязателен!
- не должен изменять состояние компонента!
  
**6. componentDidMount()**
- после render

**7. getSnapshotBeforeUpdate(prevProps, prevState)**
- позволяет захватить информацию из DOM непосредственно перед изменением
- передает в п. 7 возвращаемое значение

**8. componentDidUpdate()**
- компонент изменен
- вызывается сразу после обновления (но НЕ при ПЕРВОЙ отрисовке)
- получает из п. 6 значение в качестве параметра snapshot


**9. componentWillUnmount()**
- вызывается до того, как компонент будет уничтожен (удален из DOM)
- используется для очистки

**10. componentDidCatch(error, info)**
- используется для обработки ошибок в компонентах