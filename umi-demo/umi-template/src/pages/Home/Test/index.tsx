import connect from '@/common/connect';

function Test(){
    return <div></div>
}

export default connect(['filterData', 'a'], 'home')(Test)