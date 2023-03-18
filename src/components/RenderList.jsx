const RenderList = (props, ref) => {
    return <ul>
        {
            props.list.map(e => {
                return <li key={e.id}>{e.data.fileData}</li>
            })
        }
    </ul>
}

export default RenderList;