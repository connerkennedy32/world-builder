import React, {
    forwardRef, useEffect, useImperativeHandle,
    useState,
} from 'react'

import Styles from './styles.module.css'

const MentionList = forwardRef(function MentionList(props: any, ref) {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = (index: number) => {
        const item = props.items[index]

        if (item) {
            props.command({ id: item })
        }
    }

    const upHandler = () => {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
    }

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length)
    }

    const enterHandler = () => {
        selectItem(selectedIndex)
    }

    useEffect(() => setSelectedIndex(0), [props.items])

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: any) => {
            if (event.key === 'ArrowUp') {
                upHandler()
                return true
            }

            if (event.key === 'ArrowDown') {
                downHandler()
                return true
            }

            if (event.key === 'Enter') {
                enterHandler()
                return true
            }

            return false
        },
    }))

    return (
        <div className={Styles.items}>
            {props.items.length
                ? props.items.map((item: any, index: any) => (
                    <button
                        className={index === selectedIndex ? Styles.is_selected : Styles.item}
                        key={index}
                        onClick={() => selectItem(index)}
                    >
                        {item}
                    </button>
                ))
                : <div className={Styles.item}>No result</div>
            }
        </div >
    )
})

export default MentionList;