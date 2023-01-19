/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      foreignKeys: {
        references: 'threads(id)',
        onDelete: 'cascade',
      },
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      foreignKeys: {
        references: 'users(id)',
        onDelete: 'cascade',
      },
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    deleted_at: {
      type: 'TIMESTAMP',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
