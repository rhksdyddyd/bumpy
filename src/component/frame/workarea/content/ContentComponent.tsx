import React from 'react';
import classNames from 'classnames';
import styles from 'scss/component/frame/workarea/content/Content.module.scss';
import EditViewComponent from '../edit/EditViewComponent';
import CompositeViewComponent from '../composite/CompositeViewComponent';
import ListViewComponent from '../list/ListViewComponent';
import NoteViewComponent from '../note/NoteViewComponent';

const ContentComponent = (): React.JSX.Element => {
  const editCompositeViewComponent: React.JSX.Element = (
    <div className={classNames(styles.edit)}>
      <CompositeViewComponent
        firstChild={<EditViewComponent />}
        secondChild={<NoteViewComponent />}
        ratio={85}
        flexDirection="column"
      />
    </div>
  );

  const listCompositeViewComponent: React.JSX.Element = (
    <div className={classNames(styles.list)}>
      <CompositeViewComponent
        firstChild={<ListViewComponent />}
        secondChild={editCompositeViewComponent}
        ratio={10}
        flexDirection="row"
      />
    </div>
  );

  return <div className={classNames(styles.container)}>{listCompositeViewComponent}</div>;
};

export default React.memo(ContentComponent);
