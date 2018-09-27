import React from 'react';
import ReactTable from 'react-table';

class EngagementTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [
                {
                    name: "Mars Moses",
                    email: "iammarsmoses@gmail.com",
                    links: "http://twitter.com",
                    source: "Bandcamp",
                    tags: "[fan] [friend]",
                    notes: "has some good stuff. and is very nice"
                },
                {
                    name: "Mars Moses",
                    email: "iammarsmoses@gmail.com",
                    links: "http://twitter.com",
                    source: "Bandcamp",
                    tags: "[fan] [friend]",
                    notes: "has some good stuff. and is very nice"
                },
                {
                    name: "Mars Moses",
                    email: "iammarsmoses@gmail.com",
                    links: "http://twitter.com",
                    source: "Bandcamp",
                    tags: "[fan] [friend]",
                    notes: "has some good stuff. and is very nice"
                },
            ]
        }
    }
    render() {
        const {dataList} = this.state;
        const columns = [
            {
                Header: 'Name',
                accessor: 'name'
            },
            {
                Header: 'Email',
                accessor: 'email'
            },
            {
                Header: 'Links',
                accessor: 'links'
            },
            {
                Header: 'Source',
                accessor: 'source'
            },
            {
                Header: 'Tags',
                accessor: 'tags'
            },
            {
                Header: 'Notes',
                accessor: 'notes'
            },
        ]
        return (
            <ReactTable 
                data={dataList}
                columns={columns}
                showPagination={false}
            />
        )
    }
}

export default EngagementTable;