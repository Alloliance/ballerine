import { Prisma } from '@prisma/client';
import {RequestProjectContext} from "@/common/utils/request-project-context";
import {PrismaService} from "@/prisma/prisma.service";

export interface PrismaGeneralQueryArgs {
  select?: Record<string, unknown> | null
  include?: Record<string, unknown> | null
  where?: Record<string, unknown> | null
  orderBy?: Record<string, unknown> | null
  cursor?: Record<string, unknown> | null
  take?: number
  skip?: number
  distinct?: Record<string, unknown> | null
}
export interface PrismaGeneralInsertArgs extends PrismaGeneralQueryArgs {
  data: Record<string, unknown> | null
}

export interface PrismaGeneralUpsertArgs extends PrismaGeneralQueryArgs {
  create: Record<string, unknown> | null
  update: Record<string, unknown> | null
  where: Record<string, unknown> | null
}
export class ProjectScopedRepository {
  constructor(protected readonly prisma: PrismaService) {}
  scopeFindMany<T extends PrismaGeneralQueryArgs>(
    args?: Prisma.SelectSubset<T, PrismaGeneralQueryArgs>,
  ): T {
    const projectId = RequestProjectContext.getProjectId();

    // @ts-ignore
    args ||= {}
    args!.where = {
      ...args?.where,
      projectId: projectId,
    }

    return args!
  }


  scopeFindOne<T extends PrismaGeneralQueryArgs>(
    args: Prisma.SelectSubset<T, PrismaGeneralQueryArgs>,
  ) {
    const projectIds = RequestProjectContext.getProjectId();
// if proejct/user == admin ... dont filter by project
    args.where = {
      ...args?.where,
      projectId: projectIds,
    }

    return args;
  }

  scopeCreate<T extends PrismaGeneralInsertArgs>(
    args: Prisma.SelectSubset<T, PrismaGeneralInsertArgs>,
  ) {
    const projectId = RequestProjectContext.getProjectId();

    args.data = {
      ...args.data,
      projectId: projectId,
    }

    return args;
  }

  scopeUpdate<T extends Prisma.FilterUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.FilterUpdateArgs>,
  ) {
    const projectId = RequestProjectContext.getProjectId();

    args = this.scopeCreate(args)
    args.where = {
      ...args.where,
      projectId: projectId,
    }
    args.data = {
      ...args.data,
      projectId: projectId,
    }
    return args;
  }

  scopeUpsert<T extends PrismaGeneralUpsertArgs>(
    args: Prisma.SelectSubset<T, PrismaGeneralUpsertArgs>,
  ) {
    const projectId = RequestProjectContext.getProjectId();
    args.where = {
      ...args.where,
      projectId: projectId,
    }
    args.update = {
      ...args.update,
      projectId: projectId,
    }
    args.create = {
      ...args.create,
      projectId: projectId,
    }

    return args;
  }

  scopeDelete<T extends Prisma.FilterDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.FilterDeleteArgs>,
  ) {
    const projectId = RequestProjectContext.getProjectId();
    args.where = {
      projectId: projectId,
      ...args.where,
    }
    return args;
  }
}
