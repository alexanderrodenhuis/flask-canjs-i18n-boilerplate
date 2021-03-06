# coding=UTF-8
"""
    application.user.__init__
    ~~~~~~~~~~~~~~~~~~~~~~~~~~
    by dorajistyle

    __init__ user module

"""

from flask_security.registerable import register_user
from flask_security import current_user, login_user, AnonymousUser

from application.core import Service, db, DictEncoder, security
from models import *
from application.properties import USER_FOLLOWERS_PER_PAGE, USER_FOLLOWING_PER_PAGE, \
    USER_PER_PAGE, ROLE_PER_PAGE, FILTER_USER_LIMIT


class ConnectionService(Service):
    __model__ = Connection


class RoleService(Service):
    __model__ = Role

    def create_role(self, **kwargs):
        """
        Create a role.
        :param kwargs:
        :return:
        """
        kwargs = DictEncoder.encode(kwargs)
        role = security.datastore.find_or_create_role(**kwargs)
        db.session.commit()
        return role

    def find_or_create_role(self, name):
        """
        Find or create a role.
        :param name:
        :return:
        """
        role = security.datastore.find_or_create_role(name)
        return role

    def update_role(self, role, **kwargs):
        """
        Update a role.
        :param role:
        :param kwargs:
        :return:
        """
        role = self.update(role, **kwargs)
        db.session.commit()
        return role

    def paginate(self, page):
        """
        Get roles with pagination.
        :param page:
        :return:
        """
        roles_page = self.__model__.query.paginate(page, ROLE_PER_PAGE, False)
        return roles_page.items, roles_page.has_prev, roles_page.has_next

    def delete_role(self, role):
        """
        Delete a role.
        :param role:
        :return:
        """
        if role.name is 'admin':
            return False
        self.delete(role)
        return True

    def user_count(self, role):
        """
        Get a count that role have how many users.
        :param role:
        :return:
        """
        return role.users.count()


class UsersAdminService(Service):
    __model__ = UserAdmin


class UsersService(Service):
    __model__ = User

    def __init__(self, *args, **kwargs):
        super(UsersService, self).__init__(*args, **kwargs)
        self.connections = ConnectionService()
        self.roles = RoleService()
        self.users_admin = UsersAdminService()

    # def _preprocess_params(self, kwargs):
    #     kwargs = super(UsersService, self)._preprocess_params(kwargs)
    #     connections = kwargs.get('connections', [])
    #     if connections and all(isinstance(c, int) for c in connections):
    #         kwargs['connections'] = self.connections.get_all(*connections)
    #     return kwargs

    def me(self):
        """
        Return current user object.

        :return: user
        """
        return current_user._get_current_object()

    def remove_connections(self, provider_id):
        """
        Remove social connections (Disconnection)
        :param provider_id:
        :return:
        """
        me = self.me()
        connections = me.connections.filter_by(provider_id=provider_id)
        for c in connections:
            self.connections.delete(c)
        return True

    def set_json_temp(self, arr):
        self.__model__.__json_temp__ = arr

    def reset_json_temp(self):
        self.__model__.__json_temp__ = []

    def set_json_hidden(self, arr):
        self.__model__.__json_hidden__ = arr

    def reset_json_hidden(self):
        self.__model__.__json_hidden__ = []

    def create_user(self, **kwargs):
        """
        Create a new user. (Registration)
        :param kwargs:
        :return:
        """
        kwargs = DictEncoder.encode(kwargs)
        kwargs['email'] = kwargs.pop('registrationEmail')
        kwargs['password'] = kwargs.pop('registrationPassword')
        # for k in kwargs:
        #     print(k)
        user = register_user(**kwargs)
        db.session.commit()
        return user

    def delete_user(self, user):
        """
        Delete a user.
        :param user:
        :return:
        """
        security.datastore.delete_user(user)
        db.session.commit()
        return True

    def login_user(self, user, remember):
        """
        Login user
        :param user:
        :param remember:
        :return:
        """
        login_user(user, remember=remember)
        db.session.commit()
        return True

    def is_current(self, user):
        """
        Check user is current user.
        :param user:
        :return:
        """
        me = self.me()
        return user == me

    def is_anonymous(self):
        """
        Check current user is anonymous.

        :return:
        """
        me = self.me()
        if isinstance(me, AnonymousUser):
            return True
        return False

    def is_authenticated(self):
        """
        Check user is authenticated.

        :return:
        """
        return current_user.is_authenticated()

    def paginate(self, page):
        """
        Get users with pagination.
        :param page:
        :return:
        """
        users_page = self.__model__.query.paginate(page, USER_PER_PAGE, False)
        return users_page.items, users_page.has_prev, users_page.has_next

    def is_following(self, user):
        """
        Check current user is following target user.
        :param user:
        :return:
        """
        me = self.me()
        if not self.is_authenticated():
            return False
        return me.following.filter(followers.c.following_id == user.id).count() > 0

    def followers_count(self, user):
        """
        Get followers count.
        :param user:
        :return:
        """
        return user.followers.count()

    def followers(self, user, page):
        """
        Get followers with pagination.
        :param user:
        :param page:
        :return:
        """
        followers_page = user.followers.paginate(page, USER_FOLLOWERS_PER_PAGE)
        return followers_page.items, followers_page.has_next

    def following_count(self, user):
        """
        Get following count.
        :param user:
        :return:
        """
        return user.following.count()

    def following(self, user, page):
        """
        Get following with pagination.
        :param user:
        :param page:
        :return:
        """
        following_page = user.following.paginate(page, USER_FOLLOWING_PER_PAGE)
        return following_page.items, following_page.has_next

    def follow(self, user):
        """
        Current user follow target user.
        :param user:
        :return:
        """
        me = self.me()
        if not self.is_following(user):
            me.following.append(user)
            db.session.commit()
            return True
        return False

    def unfollow(self, user):
        """
        Current user unfollow target user.
        :param user:
        :return:
        """
        me = self.me()
        if self.is_following(user):
            me.following.remove(user)
            db.session.commit()
            return True
        return False

    def has_admin(self):
        """
        Check that current user is admin.
        :return:
        """
        return self.has_role(self.me(), 'admin')

    def is_user_me(self, user):
        return user is self.me()

    def user_equals_me(self, user):
        return user == self.me()

    def filter_like_email(self, email):
        return self.__model__.query.filter(self.__model__.email.ilike("%"+email+"%")).limit(FILTER_USER_LIMIT).all()

    def has_role(self, user, name):
        """
        Check if has role
        :param user:
        :param name:
        :return:
        """
        role = security.datastore.find_or_create_role(name)
        return user.has_role(role)

    def add_role_to_user(self, user, role):
        """
        Add role to user
        :param user:
        :param role:
        :return:
        """
        status = security.datastore.add_role_to_user(user, role)
        db.session.commit()
        return status

    def remove_role_from_user(self, user, role):
        """
        Remove role from user
        :param user:
        :param role:
        :return:
        """
        if role.name == 'admin' and self.roles.user_count(role) == 1:
            return False
        status = security.datastore.remove_role_from_user(user, role)
        db.session.commit()
        return status

    def activate_user(self, user):
        """
        Activate user
        :param user:
        :return:
        """
        status = security.datastore.activate_user(user)
        db.session.commit()
        return status

    def deactivate_user(self, user):
        """
        Deactivate user
        :param user:
        :return:
        """
        status = security.datastore.deactivate_user(user)
        db.session.commit()
        return status

    def has_facebook_connection(self):
        """
        Check current user has facebook connection.

        :return:
        """
        connections = self.me().connections.all()
        for c in connections:
            if (c.provider_id == 'facebook'):
                return True
        return False




