export const Photo = (sequelize: any, Sequelize: any) => {
  return sequelize.define('photo', {
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    url: {
      type: Sequelize.STRING
    }
  });
  ;
};
