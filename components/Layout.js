import React from 'react' ;

export default props => {
    return (
        <div>
            <h3> i  am header </h3>
            {
                props.children
            }
            <h3> i am footer </h3>
        </div>
    )
}

