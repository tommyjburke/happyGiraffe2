import { Modal, Table } from 'antd'

const MyClassesList = ({ groupMembers, visible, onCancel }) => {
   const columns = [
      {
         title: 'Username',
         dataIndex: 'username',
      },
      {
         title: 'Name',
         dataIndex: 'name',
      },
      {
         title: 'School Name',
         dataIndex: 'schoolName',
      },
      {
         title: 'Class Name',
         dataIndex: 'className',
      },
   ]

   return (
      <Modal
         open={visible}
         className='card'
         title='Group Members'
         onCancel={onCancel}
         footer={null}
      >
         <Table dataSource={groupMembers} columns={columns} />
      </Modal>
   )
}

export default MyClassesList
