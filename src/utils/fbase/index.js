import { storageService } from "fbase"
import { v4 as uuidv4 } from "uuid"

export const getAttachmentUrl = async (user, attachment) => {
  const attachmentRef = storageService
                        .ref()
                        .child(`${user.uid}/${uuidv4()}`)
  const response = await attachmentRef.putString(attachment, "data_url")
  return await response.ref.getDownloadURL()
}