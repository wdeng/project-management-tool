import { getReq, postReq } from "@/utils";
import { ChatInputType, RefineResource } from "./refine";

export interface ElementDesign {
  id: number;
  name: string;
  goal?: string;
  original?: string;
  content?: string;
  parent?: string;
  status?: 'pending' | 'done';
  contentType?: 'code' | 'file' | 'guidelines' | 'module';
  guidelines?: string;
}


export async function getSourceCode(projectId: number, fileId: number | string): Promise<ElementDesign> {
  let apiUrl = `file/source?project-id=${projectId}`;

  if (typeof fileId === 'string') {
    const encodedPath = encodeURIComponent(fileId);
    apiUrl += `&name=${encodedPath}`;
  } else if (typeof fileId === 'number')
    apiUrl += `&id=${fileId}`;
  else
    throw new Error("Either path or id must be provided");

  return await getReq(apiUrl);
}

export async function deleteFile(projectId: number, fileId: number): Promise<any> {
  return await postReq('file/delete', { projectId, fileId });
}

export interface ElementContent {
  id?: number;
  name: string;
  parent?: string;
  content: string;
  original?: string;
  goal?: string;
}

export async function updateSource(projectId: number, data: ElementDesign): Promise<any> {
  return await postReq('file/finalize-source', { projectId, data, task: "modify" });
}

export async function updateGuidelines(projectId: number, data: ElementDesign): Promise<any> {
  return await postReq('file/update-guidelines', { projectId, ...data });
}

export async function smartCreateFile(
  projectId: number,
  userInput: ChatInputType,
  fileIds: number[] = [],
  resourcesAllowed: RefineResource[] = [],
): Promise<ElementDesign> {
  const fields = {
    projectId,
    fileIds,
    resourcesAllowed,
    userInput,
  };
  return await postReq(`file/smart-create`, fields);
}

export async function smartUpdateFile(
  projectId: number,
  mainElement: ElementDesign,
  userInput: ChatInputType,
  fileIds: number[] = [],
  resourcesAllowed: RefineResource[] = [],
): Promise<any> {
  const fields = {
    projectId,
    mainElement,
    userInput,
    fileIds,
    resourcesAllowed,
  };
  return await postReq(`file/smart-update`, fields);

  //   return {
  //     "content" : `import os
  // from sqlalchemy import create_engine
  // from sqlalchemy.orm import sessionmaker, scoped_session

  // class DatabaseConnection:
  //     def __init__(self):
  //         self.engine = None
  //         self.session_factory = None

  //     def get_engine(self):
  //         if self.engine is None:
  //             try:
  //                 database_url = os.environ["DATABASE_URL"]
  //                 self.engine = create_engine(database_url, pool_size=10, max_overflow=20)
  //                 print("Database engine created successfully")
  //             except Exception as error:
  //                 print(f"Error while creating database engine: {error}")
  //         return self.engine

  //     def get_session_factory(self):
  //         if self.session_factory is None:
  //             try:
  //                 self.session_factory = sessionmaker(bind=self.get_engine())
  //                 print("Session factory created successfully")
  //             except Exception as error:
  //                 print(f"Error while creating session factory: {error}")
  //         return self.session_factory

  //     def get_session(self):
  //         try:
  //             Session = scoped_session(self.get_session_factory())
  //             session = Session()
  //             print("Session retrieved from the factory")
  //             return session
  //         except Exception as error:
  //             print(f"Error while getting session from the factory: {error}")

  //     def close_session(self, session):
  //         try:
  //             session.close()
  //             print("Session closed")
  //         except Exception as error:
  //             print(f"Error while closing session: {error}")`
  //   }
}

export async function createFile(projectId: number, file: ElementDesign): Promise<any> {
  return await postReq('file/finalize-source', { projectId, data: file, task: "create" });
}
