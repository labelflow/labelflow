# Undo Redo

This implementation was inspired by the [Command Design Pattern](https://en.wikipedia.org/wiki/Command_pattern).

## How to use it

```tsx
import { useUndoStore, Effect } from "<path>/create-undo-store";

const MyComponent = () => {
    const [bearsCount, setBearsCount] = useState(0);

    // Define your effect
    const increasePopulationEffect = (): Effect<void> => ({
        do: () => {
            setBearsCount((previousBearsCount) => previousBearsCount + 1);
        },
        undo: () => {
            setBearsCount((previousBearsCount) => previousBearsCount - 1);
        }
    });

    // Use the undo-store to have access to useful methods
    const { perform, undo, redo, canRedo, canUndo } = useUndoStore();

    return (
        <>
            <h1>{bearsCount} around here ...</h1>
            <button onClick={() => perform(increasePopulationEffect())}>one up</button>
            <button onClick={undo} disabled={!canUndo()}>undo</button>
            <button onClick={redo} disabled={!canRedo()}>redo</button>
        </>
    );
};
```

## Design choices

### 1. Do, Undo, Redo

For each effect, you need to implement an `do` and an `undo` function.
You can optionally pass a `redo` function if the `redo` logic is different from the do `logic`.

For example, if your backend support soft delete, you might want to do something like

```typescript
const createEntityEffect = (args) => {
    do: () => {
        const { id } = entity.create(args)
        return id;
    }, 
    undo: id => { 
        entity.softDelete(id);
        return id 
    },
    redo: id => {
        entity.restore(id);
        return id ;
    }
}
```

Note that:

- The `do`, `undo` and `redo` functions can be asynchronous.
- The `undo` function will only be called after the `do` function is finished.
- The `redo` (or `do` if no `redo` was provided) function will only be called after the `undo` function is finished.
- The returned value of `do` will be passed as an argument of `undo`.
- The returned value of `undo` will be passed as an argument of `redo` (or `do` if no `redo` was provided).

### 2. It does not guaranty the order of resolution of the effects

It triggers every effect as soon as they are performed. It does not
await for the previous effect before starting the new one.
It lets the user chain `undo` instructions even if the corresponding
effects are not resolved yet.

A side effect of this is that the user might see some actions get cancelled
in a different order from the one they triggered.

A way to mitigate this strange UX behavior is to implement optimistic response on the
`do`, `undo` and `redo` functions. By making those functions update the UI almost instantly,
it should let the user see the changes in the order they triggered them.
(Note: This problem is not specific to the undo redo).

An alternative to this would be to use a queue to ensure effects are performed in the
same order that they are triggered. The main inconvenient of this solution is that it would
make all the effect sequential and thus much slower.
